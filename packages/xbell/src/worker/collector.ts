import type {
  XBellTaskConfig,
  XBellTestCase,
  XBellTestCaseFunction,
  XBellTestFile,
  XBellTestGroup,
  XBellTestGroupFunction,
  XBellRuntimeOptions,
  XBellRuntime,
  XBellOptions,
  XBellTestCaseStandard,
} from '../types';
import { workerContext } from './worker-context';
import * as path from 'node:path';
import { ClassicCollector } from './classic-collector';
import { getCallSite } from '../utils/error';
import debug from 'debug';

const debugCollector = debug('xbell:collector');

export interface XBellCollector {
  testFiles: Promise<XBellTestFile[]>;
  collectGroup(
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions,
  ): Promise<void>;
  collectCase<NodeJSExtensionArg, BrowserExtensionArg>(
    caseDescription: string,
    testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions
  ): Promise<void>;
}

export interface XBellCollectorConstructor {
}

export class Collector {
  public currentFile?: XBellTestFile;
  public currentGroup?: XBellTestGroup;
  public classic = new ClassicCollector(this);
  protected uuid: number = 1;

  protected createFile(filename: string): XBellTestFile {
    return {
      filename,
      tasks: [],
      config: {},
      logs: [],
      mocks: new Map(),
      browserMocks: new Map(),
      options: {
        only: 0,
        skip: 0,
        todo: 0,
      },
    };
  }

  protected createGroup({
    groupDescription,
    config,
    runtimeOptions,
    options,
  }: {
    groupDescription: string,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions,
    options: XBellOptions,
  }): XBellTestGroup {
    return {
      uuid: this.genUuid(),
      type: 'group',
      groupDescription: groupDescription,
      filename: this.currentFile!.filename,
      cases: [],
      config,
      runtimeOptions,
      options,
    }
  }

  protected createCase(
   {
    caseDescription,
    testCaseFunction,
    config,
    runtime,
    runtimeOptions,
    options,
    _testFunctionFilename
   }: {
    caseDescription: string,
    testCaseFunction: XBellTestCaseFunction<any, any>,
    config: XBellTaskConfig,
    runtime: XBellRuntime,
    runtimeOptions: XBellRuntimeOptions,
    options: XBellOptions,
    _testFunctionFilename?: string,
   }
  ): XBellTestCaseStandard<any, any> {
    return {
      type: 'case',
      runtime,
      caseDescription,
      testFunction: testCaseFunction,
      filename: this.currentFile!.filename,
      groupDescription: this.currentGroup?.groupDescription,
      status: 'waiting',
      config,
      runtimeOptions,
      uuid: this.genUuid(),
      options: {
        ...options,
        ...this.currentGroup?.options,
      },
      _testFunctionFilename,
      mocks: this.currentFile!.mocks,
      browserMocks: this.currentFile!.browserMocks,
    }
  }

  public genUuid() {
    return String(workerContext.workerData.workerId) + '-' + String(this.uuid ++);
  }

  public async collect(filename: string) {
      this.currentFile = this.createFile(filename);
      this.classic.startFileCollection(this.currentFile);
      await import(filename);
      const tasksFromClassic = this.classic.finishFileCollection();
      debugCollector(tasksFromClassic);
      this.currentFile.tasks = [
        ...this.currentFile.tasks,
        ...tasksFromClassic,
      ]
      return this.currentFile;
  }

  public async collectGroup(
    {
      groupDescription,
      testGroupFunction,
      runtimeOptions,
      config,
      options
    }: {
      groupDescription: string,
      testGroupFunction: XBellTestGroupFunction,
      config: XBellTaskConfig,
      runtimeOptions: XBellRuntimeOptions,
      options: XBellOptions,
    }
  ) {
    this.currentGroup = this.createGroup({
      groupDescription,
      config,
      runtimeOptions,
      options,
    });
    this.currentFile!.tasks.push(this.currentGroup);
    await testGroupFunction();
    this.currentGroup = undefined;
  }

  public async collectCase(
    {
      caseDescription,
      testCaseFunction,
      options,
      config,
      runtimeOptions,
      runtime,
      _testFunctionFilename,
    }: {
      caseDescription: string,
      testCaseFunction: XBellTestCaseFunction<any, any>,
      options: XBellOptions,
      config: XBellTaskConfig,
      runtimeOptions: XBellRuntimeOptions,
      runtime: XBellRuntime,
      _testFunctionFilename?: string,
    }
  ) {
    const testCase = this.createCase({
      caseDescription,
      runtimeOptions,
      runtime,
      testCaseFunction,
      config,
      options,
      _testFunctionFilename,
    })
    if (this.currentGroup) {
      this.currentGroup.cases.push(testCase);
    } else {
      this.currentFile!.tasks.push(testCase);
    }

    // group: skip, case: only, will be { skip: true, only: true }, same as { skip: true }
    if (testCase.options.skip) {
      this.currentFile!.options.skip++;
    } else if (testCase.options.todo) {
      this.currentFile!.options.todo++;
    } else if (testCase.options.only) {
      this.currentFile!.options.only++;
    }
  }

  public collectMock(mockPath: string, factory: (args: any) => any) {
    this.currentFile!.mocks.set(mockPath, factory);
  }

  public collectBrowserMock(mockPath: string, factory: (args: any) => any) {
    this.currentFile!.browserMocks.set(mockPath, factory);
  }
}

export const collector = new Collector();

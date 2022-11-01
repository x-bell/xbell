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
  currentFile?: XBellTestFile;
  currentGroup?: XBellTestGroup;
  protected uuid: number = 1;
  public classic = new ClassicCollector(this);

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

  protected createFile(filename: string): XBellTestFile {
    return {
      filename,
      tasks: [],
      config: {},
      logs: [],
      mocks: new Map(),
      browserMocks: new Map(),
    }
  }

  protected createGroup(
    groupDescription: string,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions,
  ): XBellTestGroup {
    return {
      uuid: this.genUuid(),
      type: 'group',
      groupDescription: groupDescription,
      filename: this.currentFile!.filename,
      cases: [],
      config,
      runtimeOptions,
      options: {}
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
      options,
      _testFunctionFilename,
      mocks: this.currentFile!.mocks,
      browserMocks: this.currentFile!.browserMocks,
    }
  }

  public async collectGroup(
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions,
  ) {
    this.currentGroup = this.createGroup(groupDescription, config, runtimeOptions);
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
  }

  public collectMock(mockPath: string, factory: (args: any) => any) {
    this.currentFile!.mocks.set(mockPath, factory);
  }

  public collectBrowserMock(mockPath: string, factory: (args: any) => any) {
    this.currentFile!.browserMocks.set(mockPath, factory);
  }
}

export const collector = new Collector();

import type {
  XBellTaskConfig,
  XBellTestCase,
  XBellTestCaseFunction,
  XBellTestFile,
  XBellTestGroup,
  XBellTestGroupFunction,
  XBellRuntimeOptions,
  XBellCaseTagInfo,
  XBellRuntime,
  XBellOptions,
  XBellTestCaseStandard,
} from '../types';
import { workerContext } from './worker-context';
import { ClassicCollector } from './classic-collector';
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
   }: {
    caseDescription: string,
    testCaseFunction: XBellTestCaseFunction<any, any>,
    config: XBellTaskConfig,
    runtime: XBellRuntime,
    runtimeOptions: XBellRuntimeOptions,
    options: XBellOptions,
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
      runtime
    }: {
      caseDescription: string,
      testCaseFunction: XBellTestCaseFunction<any, any>,
      options: XBellOptions,
      config: XBellTaskConfig,
      runtimeOptions: XBellRuntimeOptions,
      runtime: XBellRuntime,
    }
  ) {
    const testCase = this.createCase({
      caseDescription,
      runtimeOptions,
      runtime,
      testCaseFunction,
      config,
      options,
    })
    if (this.currentGroup) {
      this.currentGroup.cases.push(testCase);
    } else {
      this.currentFile!.tasks.push(testCase);
    }
  }
}

export const collector = new Collector();

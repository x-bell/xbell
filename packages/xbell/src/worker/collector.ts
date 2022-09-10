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
} from '../types';
import { workerContext } from './worker-context';

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

  protected genUuid() {
    return String(workerContext.workerData.workerId) + '-' + String(this.uuid ++);
  }

  public async collect(filename: string) {
      this.currentFile = this.createFile(filename);
      await import(filename);
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
      runtimeOptions
    }
  }

  protected createCase<NodeJSExtensionArg, BrowserExtensionArg>(
   {
    caseDescription,
    testCaseFunction,
    config,
    runtime,
    runtimeOptions,
    tagInfo
   }: {
    caseDescription: string,
    testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>,
    config: XBellTaskConfig,
    runtime: XBellRuntime,
    runtimeOptions: XBellRuntimeOptions,
    tagInfo: XBellCaseTagInfo,
   }
  ): XBellTestCase<NodeJSExtensionArg, BrowserExtensionArg> {
    return {
      type: 'case',
      runtime,
      caseDescription,
      testFunction: testCaseFunction,
      tagInfo,
      filename: this.currentFile!.filename,
      groupDescription: this.currentGroup?.groupDescription,
      status: 'waiting',
      config,
      runtimeOptions,
      uuid: this.genUuid(),
    }
  }

  public async collectGroup(
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction,
    config: XBellTaskConfig,
    runtimeOptions: XBellRuntimeOptions,
  ) {
    this.currentGroup = this.createGroup(groupDescription, config, runtimeOptions);
    await testGroupFunction()
    this.currentGroup = undefined;
  }

  public async collectCase<NodeJSExtensionArg, BrowserExtensionArg>(
    {
      caseDescription,
      testCaseFunction,
      tagInfo,
      config,
      runtimeOptions,
      runtime
    }: {
      caseDescription: string,
      testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>,
      tagInfo: XBellCaseTagInfo,
      config: XBellTaskConfig,
      runtimeOptions: XBellRuntimeOptions,
      runtime: XBellRuntime,
    }
  ) {
    const testCase = this.createCase({
      caseDescription,
      tagInfo,
      runtimeOptions,
      runtime,
      testCaseFunction,
      config,
    })
    if (this.currentGroup) {
      this.currentGroup.cases.push(testCase);
    } else {
      this.currentFile!.tasks.push(testCase);
    }
  }
}

export const collector = new Collector();

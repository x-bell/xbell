import type { fn, spyOn } from '@xbell/assert';
import type { XBellTaskConfig, XBellRuntimeOptions, XBellProject } from './config';
import type { Expect } from '../worker/expect/expect';
import type { Page } from './page';
import type {
  XBellTestCaseStatus,
  XBellError,
  XBellTestFileRecord,
  XBellWorkerLog,
} from './record';

export type XBellMocks = Map<string, ((args: any) => any) | undefined>;

export interface XBellOptions {
  skip?: boolean;
  todo?: boolean;
  only?: boolean;
  each?: {
    item: any;
    index: number;
  }
  batch?: {
    items?: any[];
  }
}

export interface XBellTestFile {
  filename: string;
  options:  Record<'only' | 'skip' | 'todo', number>;
  tasks: XBellTestTask[];
  config: XBellTaskConfig;
  logs: XBellWorkerLog[];
  mocks: XBellMocks;
  browserMocks: XBellMocks;
}

export interface XBellTestGroup {
  type: 'group';
  uuid: string;
  filename: string;
  groupDescription: string;
  cases: XBellTestTask[];
  config: XBellTaskConfig;
  options: XBellOptions;
  runtimeOptions: XBellRuntimeOptions;
}

export type XBellCaseTagName =
  | 'normal'
  | 'todo'
  | 'only'
  | 'each'
  | 'batch'
  | 'skip'
  | 'config'

interface XBellCaseCommonTagInfo {
  tag: XBellCaseTagName;
  options?: any;
}

export interface XBellCaseNormalTagInfo extends XBellCaseCommonTagInfo {
  tag: 'normal'
  options?: void;
}

export interface XBellCaseTodoTagInfo extends XBellCaseCommonTagInfo {
  tag: 'todo'
  options?: void;
}

export interface XBellCaseSkipTagInfo extends XBellCaseCommonTagInfo {
  tag: 'skip'
  options?: void;
}


export interface XBellCaseOnlyTagInfo extends XBellCaseCommonTagInfo {
  tag: 'only'
  options?: void;
}

export interface XBellCaseEachTagInfo extends XBellCaseCommonTagInfo {
  tag: 'each'
  options: {
    item: any
  };
}

export interface XBellCaseBatchTagInfo extends XBellCaseCommonTagInfo {
  tag: 'batch'
  options: {
    items: any[]
  };
}

export interface XBellCaseConfigTagInfo extends XBellCaseCommonTagInfo {
  tag: 'config'
  options: XBellTaskConfig;
}

export type XBellCaseTagInfo =
  | XBellCaseNormalTagInfo
  | XBellCaseTodoTagInfo
  | XBellCaseSkipTagInfo
  | XBellCaseOnlyTagInfo
  | XBellCaseBatchTagInfo
  | XBellCaseEachTagInfo
  | XBellCaseConfigTagInfo;

export type XBellRuntime =
  | 'browser'
  | 'node'

interface XBellTestCaseCommon {
  type: 'case';
  runtime: XBellRuntime;
  // tagInfo: XBellCaseTagInfo;
  uuid: string;
  filename: string;
  _testFunctionFilename?: string;
  groupDescription?: string;
  caseDescription: string;
  status: XBellTestCaseStatus;
  config: XBellTaskConfig;
  runtimeOptions: XBellRuntimeOptions;
  options: XBellOptions;
  mocks: XBellMocks;
  browserMocks: XBellMocks;
}
export interface XBellTestCaseStandard<NodeJSExtensionArg, BrowserExtensionArg> extends XBellTestCaseCommon {
  testFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>;
}

export interface XBellTestCaseClassic extends XBellTestCaseCommon {
  class: Function;
  propertyKey: string;
}

export type XBellTestCase<NodeJSExtensionArg, BrowserExtensionArg> = XBellTestCaseStandard<NodeJSExtensionArg, BrowserExtensionArg> | XBellTestCaseClassic;


export interface XBellTestGroupFunction {
  (): void
}

export interface XBellTestCaseFunctionArguments<BrowserExtensionArg = {}> {
  page: Page<BrowserExtensionArg>;
  project: XBellProject;
  expect: Expect;
  fn: typeof fn;
  spyOn: typeof spyOn;
}

export interface XBellTestCaseFunction<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> {
  (args: XBellTestCaseFunctionArguments<BrowserExtensionArg> & NodeJSExtensionArg): void
}

export interface XBellBrowserTestCaseFunction<BrowserExtensionArg = {}> {
  (args: BrowserExtensionArg): (void | Promise<void>);
}

export type XBellTestTask<NodeJSExtensionArg = any, BrowserExtensionArg = any> =
  | XBellTestGroup
  | XBellTestCase<NodeJSExtensionArg, BrowserExtensionArg>;

export interface XBellTestCaseLifecycle {
  onStart(): void;
  onFailed(): void;
  onSuccessed(): void;
}

export interface XBellWorkerLifecycle {
  onLog(log: XBellWorkerLog & { filename: string }): void;
  onFileCollectSuccesed(file: XBellTestFileRecord): void;
  onFileCollectFailed(file: XBellTestFileRecord): void;
  onCaseExecuteSkipped(c: { uuid: string }): void;
  onCaseExecuteTodo(c: { uuid: string }): void;
  onCaseExecuteStart(c: { uuid: string }): void;
  onCaseExecuteSuccessed(c: { uuid: string, coverage?: any, videos?: string[] }): void;
  onCaseExecuteFailed(c: { uuid: string, error: XBellError, videos?: string[], browserTestFunction?: { body: string; filename: string; } }): void;
  onAllDone(): Promise<void> | void;
  onExit(): void;
}

export interface XBellBrowserTest<BrowserExtArgs = {}> {
  (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  only(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T, index: number) => string), testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs & { item: T; index: number }>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<BrowserExtArgs & { item: T; index: number }>) => void;

  extend<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellBrowserTest<Awaited<ReturnType<T>>>;

  mock(path: string, factory: (args: BrowserExtArgs) => any): void;
}

export interface XBellDescribe {
  (groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  only(caseDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  skip(caseDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  todo(caseDescription: string, testGroupFunction: XBellTestGroupFunction): void;
}

export interface XBellTest<NodeJSExtArgs = {}, BrowserExtArgs = {}> {
  /** group */
  describe: XBellDescribe;

  only(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T, index: number) => string), testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T; index: number }, BrowserExtArgs>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T; index: number; }, BrowserExtArgs>) => void;

  browser: XBellBrowserTest<BrowserExtArgs>;

  extend<T extends (args: XBellTestCaseFunctionArguments<BrowserExtArgs>) => any>(nodeJSCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs>;
   /** case */
  (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;
   
  mock(path: string, factory: (args: NodeJSExtArgs) => any): void;

  extendBrowser<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellTest<NodeJSExtArgs, Awaited<ReturnType<T>>>;
}

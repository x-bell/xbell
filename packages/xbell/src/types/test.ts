import type { fn, spyOn } from '@xbell/assert';
import type {
  XBellTaskConfig,
  XBellRuntimeOptions,
  XBellProject,
} from './config';
import type { Expect } from '../worker/expect/expect';
import type { CommonPage, Page } from './page';
import type {
  XBellTestCaseStatus,
  XBellError,
  XBellTestFileRecord,
  XBellWorkerLog,
} from './record';
import type { XBellBrowserTest } from './test-browser';
import type { XBellAllTest } from './test-all';
export type XBellMocks = Map<string, ((args: any) => any) | undefined>;

export interface XBellOptions {
  skip?: boolean;
  todo?: boolean;
  only?: boolean;
  each?: {
    item: any;
    index: number;
  };
  batch?: {
    items?: any[];
  };
}

export interface XBellTestFile {
  projectName: string;
  filename: string;
  options: Record<'only' | 'skip' | 'todo', number>;
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
  | 'config';

interface XBellCaseCommonTagInfo {
  tag: XBellCaseTagName;
  options?: any;
}

export interface XBellCaseNormalTagInfo extends XBellCaseCommonTagInfo {
  tag: 'normal';
  options?: void;
}

export interface XBellCaseTodoTagInfo extends XBellCaseCommonTagInfo {
  tag: 'todo';
  options?: void;
}

export interface XBellCaseSkipTagInfo extends XBellCaseCommonTagInfo {
  tag: 'skip';
  options?: void;
}

export interface XBellCaseOnlyTagInfo extends XBellCaseCommonTagInfo {
  tag: 'only';
  options?: void;
}

export interface XBellCaseEachTagInfo extends XBellCaseCommonTagInfo {
  tag: 'each';
  options: {
    item: any;
  };
}

export interface XBellCaseBatchTagInfo extends XBellCaseCommonTagInfo {
  tag: 'batch';
  options: {
    items: any[];
  };
}

export interface XBellCaseConfigTagInfo extends XBellCaseCommonTagInfo {
  tag: 'config';
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

export type XBellRuntime = 'browser' | 'nodejs' | 'all';

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
export interface XBellTestCaseStandard<
  NodeJSExtensionArguments,
> extends XBellTestCaseCommon {
  testFunction: XBellNodeJSTestCaseFunction<NodeJSExtensionArguments>;
}

export interface XBellTestCaseClassic extends XBellTestCaseCommon {
  class: Function;
  propertyKey: string;
}

export type XBellTestCase<NodeJSExtensionArguments, BrowserExtensionArguments> =
    | XBellTestCaseStandard<NodeJSExtensionArguments>
    | XBellTestCaseClassic;

export interface XBellTestGroupFunction {
  (): void;
}

export interface TestArgumentsBasic {
  page: CommonPage;
  project: XBellProject;
  expect: Expect;
  fn: typeof fn;
  spyOn: typeof spyOn;
  sleep: (duration: number) => Promise<void>;
  runtime: 'nodejs' | 'browser';
}

export interface NodeJSTestArguments extends TestArgumentsBasic {
  page: Page;
  runtime: 'nodejs';
}

export interface XBellNodeJSTestCaseFunction<
  NodeJSExtensionArguments = {},
> {
  (
    args: NodeJSExtensionArguments
  ): void;
}

export type XBellTestTask<
  NodeJSExtensionArguments = any,
  BrowserExtensionArguments = any
> =
  | XBellTestGroup
  | XBellTestCase<NodeJSExtensionArguments, BrowserExtensionArguments>;

export interface XBellTestCaseLifecycle {
  onStart(): void;
  onFailed(): void;
  onSuccessed(): void;
}

export interface XBellWorkerLifecycle {
  onLog(log: XBellWorkerLog & { filename: string; projectName: string }): void;
  onFileCollectSuccesed(file: XBellTestFileRecord): void;
  onFileCollectFailed(file: XBellTestFileRecord): void;
  onCaseExecuteSkipped(c: { uuid: string }): void;
  onCaseExecuteTodo(c: { uuid: string }): void;
  onCaseExecuteStart(c: { uuid: string }): void;
  onCaseExecuteSuccessed(c: {
    uuid: string;
    coverage?: any;
    videos?: string[];
  }): void;
  onCaseExecuteFailed(c: {
    uuid: string;
    error: XBellError;
    videos?: string[];
    browserTestFunction?: { body: string; filename: string };
  }): void;
  onAllDone(): Promise<void> | void;
  onExit(): void;
}

export interface XBellDescribe {
  (groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  only(
    caseDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ): void;
  skip(
    caseDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ): void;
  todo(
    caseDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ): void;
}

export interface XBellTest<
  NodeJSExtensionArguments = {},
  BrowserExtensionArguments = {},
  CommonExtensionArguments = {}
> {
  /** group */
  describe: XBellDescribe;

  only(
    caseDescription: string,
    testCaseFunction: XBellNodeJSTestCaseFunction<
      NodeJSExtensionArguments
    >
  ): void;

  skip(
    caseDescription: string,
    testCaseFunction: XBellNodeJSTestCaseFunction<NodeJSExtensionArguments>
  ): void;

  todo(
    caseDescription: string,
    testCaseFunction: XBellNodeJSTestCaseFunction<
      NodeJSExtensionArguments
    >
  ): void;

  each<T>(
    items: T[]
  ): (
    caseDescription: string | ((item: T, index: number) => string),
    testCaseFunction: XBellNodeJSTestCaseFunction<NodeJSExtensionArguments & { item: T; index: number }>
  ) => void;

  batch<T>(
    items: T[]
  ): (
    caseDescription: string,
    testCaseFunction: XBellNodeJSTestCaseFunction<NodeJSExtensionArguments & { item: T; index: number }>
  ) => void;

  mock(path: string, factory: (args: NodeJSExtensionArguments) => any): void;

  browser: XBellBrowserTest<BrowserExtensionArguments>;

  all: XBellAllTest<CommonExtensionArguments>;

  extend<T extends (args: NodeJSExtensionArguments) => any>(
  nodeJSCallback: T
): XBellTest<
  Awaited<ReturnType<T>>,
  BrowserExtensionArguments,
  CommonExtensionArguments
>;
/** case */
(
  caseDescription: string,
  testCaseFunction: XBellNodeJSTestCaseFunction<NodeJSExtensionArguments>
): void;

  extendBrowser<T extends (args: BrowserExtensionArguments) => any>(
    browserCallback: T
  ): XBellTest<
    NodeJSExtensionArguments,
    Awaited<ReturnType<T>>,
    CommonExtensionArguments
  >;

  extendAll<T extends (args: CommonExtensionArguments) => any>(
    commonCallback: T
  ): XBellTest<
    NodeJSExtensionArguments,
    BrowserExtensionArguments,
    Awaited<ReturnType<T>>
  >;
}

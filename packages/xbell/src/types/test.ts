import type { expell } from 'expell';
import type { XBellTaskConfig, XBellRuntimeOptions } from './config';
import type {
  TimeoutOptions,
  ElementHandleClickOptions,
  ElementHandleDblclickOptions,
  ElementHandleHoverOptions,
  ElementHandleUncheckOptions,
  ElementHandleCheckOptions,
  Rect,
  FrameGotoOptions,
  Response,
  LifecycleEvent
} from './pw';

export type XBellError = { name: string; message: string; stack?: string };

export type XBellTestCaseStatus =
  | 'successed'
  | 'failed'
  | 'running'
  | 'waiting';

export interface XBellTestCaseRecord {
  type: 'case';
  uuid: string;
  filename: string;
  groupDescription?: string;
  caseDescription: string;
  status: XBellTestCaseStatus;
  error?: XBellError;
}

export interface XBellTestGroupRecord {
  type: 'group';
  filename: string;
  uuid: string;
  groupDescription: string;
  cases: XBellTestTaskRecord[];
}

export type XBellTestTaskRecord =
  | XBellTestGroupRecord
  | XBellTestCaseRecord;


export interface XBellTestFileRecord {
  filename: string;
  tasks: XBellTestTaskRecord[];
  logs: XBellWorkerLog[];
  error?: XBellError;
}

export interface XBellWorkerLog {
  type: 'stdout' | 'stderr';
  content: string;
}

export interface XBellTestFile {
  filename: string;
  tasks: XBellTestTask[];
  config: XBellTaskConfig;
  logs: XBellWorkerLog[];
}

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
  groupDescription?: string;
  caseDescription: string;
  status: XBellTestCaseStatus;
  config: XBellTaskConfig;
  runtimeOptions: XBellRuntimeOptions;
  options: XBellOptions;
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

interface XBellPageExecutor<BrowserExtensionArg> {
  (arg: BrowserExtensionArg): void;
}

export interface XBellElementHandle {
  focus(): Promise<void>
  click(options?: ElementHandleClickOptions): Promise<void>;
  dblclick(options?: ElementHandleDblclickOptions): Promise<void>;
  hover(options?: ElementHandleHoverOptions): Promise<void>;
  check(options?: ElementHandleCheckOptions): Promise<void>
  uncheck(options?: ElementHandleUncheckOptions): Promise<void>
  isVisible(): Promise<boolean>;
  isChecked(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isHidden(): Promise<boolean>;
  boundingBox(): Promise<Rect | null>;
}

export interface XBellLocator {
  focus(options?: TimeoutOptions): Promise<void>
  click(options?: ElementHandleClickOptions): Promise<void>;
  dblclick(options?: ElementHandleDblclickOptions): Promise<void>;
  hover(options?: ElementHandleHoverOptions): Promise<void>;
  check(options?: ElementHandleCheckOptions): Promise<void>
  uncheck(options?: ElementHandleUncheckOptions): Promise<void>
  isVisible(options?: TimeoutOptions): Promise<boolean>;
  isChecked(options?: TimeoutOptions): Promise<boolean>;
  isDisabled(options?: TimeoutOptions): Promise<boolean>;
  isHidden(options?: TimeoutOptions): Promise<boolean>;
  boundingBox(options?: TimeoutOptions): Promise<Rect | null>;
}

export interface XBellPage<BrowserExtensionArg> {
  evaluate: <Args>(func: XBellPageExecutor<BrowserExtensionArg & Args>, args?: Args) => void;
  locateByText(text: string): XBellLocator;
  queryByText(text: string): Promise<XBellElementHandle | null>;
  close(): Promise<void>;
  goto(url: string, options?: FrameGotoOptions): Promise<Response | null>;
  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'>, options?: { timeout?: number }): Promise<void>;
}

export interface XBellTestCaseFunctionArguments<BrowserExtensionArg> {
  page: XBellPage<BrowserExtensionArg>;
}

export interface XBellTestCaseFunction<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> {
  (args: XBellTestCaseFunctionArguments<BrowserExtensionArg> & NodeJSExtensionArg): void
}

export interface XBellBrowserTestCaseFunction<BrowserExtensionArg = {}> {
  (args: { expect: typeof expell } & BrowserExtensionArg): void | Promise<void>;
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
  // onFileCollectStart(file: XBellTestFileRecord): void;
  onFileCollectSuccesed(file: XBellTestFileRecord): void;
  onFileCollectFailed(file: XBellTestFileRecord): void;
  onCaseExecuteStart(c: { uuid: string }): void;
  onCaseExecuteSuccessed(c: { uuid: string }): void;
  onCaseExecuteFailed(c: { uuid: string, error: XBellError }): void;
  onExit(): void;
}

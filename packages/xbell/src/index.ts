import type {
  TestArguments as TestArgumentsType,
  TestBatchArguments as TestBatchArgumentsType,
  TestEachArguments as TestEachArgumentsType,
  Page as PageType,
  Locator as LocatorType,
  FrameLocator as FrameLocatorType,
  ElementHandle as ElementHandleType,
} from './types';
export {
  test,
  describe,
  // exp
} from './worker/test';

export {
  expect,
} from './worker/expect/expect';

export {
  spyOn,
  fn,
} from './worker/utils';

export {
  Test,
  Todo,
  Only,
  Skip,
  SkipProjects,
  Each,
  Batch,
  Fixtrue,
  DisplayName,
} from './worker/classic-decorators';
export { Browser } from './common/browser';

export {
  defineConfig
} from './common/configurator';

export type {
  XBellConfig,
  XBellProject as Project,
  XBellTest,
  BrowserTestArguments,
  Loader
} from './types';

export type { ToMatchJavaScriptSnapshotOptions as ToMatchSnapshotOptions, ToMatchImageSnapshotOptions } from '@xbell/snapshot';
// @ts-ignore
// resolve swc problem https://github.com/swc-project/swc/issues/1065
const testArguments: TestArgumentsType = {};
// @ts-ignore
const testEachArguments: TestEachArgumentsType = {};
// @ts-ignore
const testBatchArguments: TestBatchArgumentsType = {};
// @ts-ignore
const page: PageType = {};
// @ts-ignore
const locator: LocatorType = {};
// @ts-ignore
const frameLocator: FrameLocatorType = {};
// @ts-ignore
const elementHandle: ElementHandleType = {};

// TODO: types...
export {
  testArguments as TestArguments,
  testEachArguments as TestEachArguments,
  testBatchArguments as TestBatchArguments,
  page as Page,
  locator as Locator,
  frameLocator as FrameLocator,
  elementHandle as ElementHandle,
};

export type Page = PageType;
export type FrameLocator = FrameLocatorType;
export type Locator = LocatorType;
export type ElementHandle = ElementHandleType;
export type TestArguments = TestArgumentsType;
export type TestEachArguments<T> = TestEachArgumentsType<T>;
export type TestBatchArguments<T> = TestBatchArgumentsType<T>;

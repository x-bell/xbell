// export {
//   Depend,
//   Group,
//   Case,
//   Inject,
//   BatchData,
//   BeforeEachCase,
//   AfterEachCase,
//   Fixture,
//   Context,
//   Init,
//   Data,
//   Expect,
//   Viewport,
//   Config,
//   RunEnvs,
//   RunBrowsers,
//   Sleep,
//   defineDecorator,
// } from './core/index';

// export {
//   sleep
// } from './utils/index';

// export {
//   XBellConfig,
//   MultiEnvData
// } from './types/index';

import type {
  TestArguments as TestArgumentsType,
  Page as PageType,
  Locator as LocatorType,
  FrameLocator as FrameLocatorType,
  ElementHandle as ElementHandleType,
} from './types';
export {
  test,
  describe,
  // exp
} from './worker/standard';

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

export type {
  FixtureFunction,
  XBellConfig,
  XBellProject as Project,
  XBellTest,
} from './types';

// @ts-ignore
// resolve swc problem https://github.com/swc-project/swc/issues/1065
const testArguments: TestArgumentsType = {};
// @ts-ignore
const page: PageType = {};
// @ts-ignore
const locator: LocatorType = {};
// @ts-ignore
const frameLocator: FrameLocatorType = {};
// @ts-ignore
const elementHandle: ElementHandleType = {};

export {
  testArguments as TestArguments,
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

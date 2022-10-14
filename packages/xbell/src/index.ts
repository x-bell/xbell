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

// export type {
//   Page,
//   FrameLocator,
//   Locator,
//   ElementHandle
// } from 'playwright-core';
import type { TestArguments } from './types/parameter';
export {
  test,
  describe,
  // exp
} from './worker/standard';

export {
  expect,
} from './worker/expect/expect';

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

export {
  Page,
} from './worker/page';

export {
  FixtureFunction,
  XBellConfig,
  XBellProject as Project,
} from './types';

// @ts-ignore
// resolve swc problem https://github.com/swc-project/swc/issues/1065
const testArguments: TestArguments = {};

export {
  testArguments as TestArguments,
};

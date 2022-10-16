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

import type { TestArguments as TestArgumentsType } from './types/parameter';
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
  Locator,
} from './worker/locator';

export {
  ElementHandle,
} from './worker/element-handle';

export {
  FixtureFunction,
  XBellConfig,
  XBellProject as Project,
} from './types';

// @ts-ignore
// resolve swc problem https://github.com/swc-project/swc/issues/1065
const testArguments: TestArgumentsType = {};

export {
  testArguments as TestArguments,
};

export type TestArguments = TestArgumentsType;

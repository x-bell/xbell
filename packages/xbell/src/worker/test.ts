import type {
  XBellTestGroupFunction,
  XBellTest,
  XBellDescribe,
  XBellBrowserCallback,
  XBellNodeJSCallback,
  XBellCommonCallback,
  NodeJSTestArguments,
  BrowserTestArguments,
  AllTestArguments,
} from '../types';
import * as path from 'node:path';
import { fileURLToPath } from '../utils/path';
import { collector } from './collector';
import { getCallSite } from '../utils/error';
import { getSortValue } from '../utils/sort';
import { createBrowserTest } from './test-browser';
import { createAllTest } from './test-all';

export function createTest<
  NodeJSExtensionArguments = {},
  BrowserExtensionArguments = {},
  CommonExtensionArguments = {}
>(
  nodejsCallbacks: Array<XBellNodeJSCallback> = [],
  browserCallbacks: Array<XBellBrowserCallback> = [],
  commonCallbacks: Array<XBellCommonCallback> = []
): XBellTest<
  NodeJSExtensionArguments,
  BrowserExtensionArguments,
  CommonExtensionArguments
> {
  const test: XBellTest<
    NodeJSExtensionArguments,
    BrowserExtensionArguments,
    CommonExtensionArguments
  > = (
    caseDescription,
    testCaseFunction,
  ) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'nodejs',
      runtimeOptions: {
        browserCallbacks,
        nodejsCallbacks,
      },
      config: {},
      options: {},
    });
  };

  test.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        todo: true,
      },
      config: {},
      runtime: 'nodejs',
      runtimeOptions: {
        browserCallbacks,
      },
    });
  };

  test.skip = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        skip: true,
      },
      config: {},
      runtime: 'nodejs',
      runtimeOptions: {
        browserCallbacks,
      },
    });
  };

  test.only = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        only: true,
      },
      config: {},
      runtime: 'nodejs',
      runtimeOptions: {
        browserCallbacks,
      },
    });
  };

  test.each = (items) => {
    return (caseDescriptionArg, testCaseFunction) => {
      items.forEach((item, index) => {
        const caseDescription =
          typeof caseDescriptionArg === 'function'
            ? caseDescriptionArg(item, index)
            : caseDescriptionArg;
        collector.collectCase({
          caseDescription,
          testCaseFunction,
          options: {
            each: {
              item,
              index,
            },
          },
          config: {},
          runtime: 'nodejs',
          runtimeOptions: {
            browserCallbacks,
          },
        });
      });
    };
  };

  test.batch = (items) => {
    return (caseDescription, testCaseFunction) => {
      collector.collectCase({
        caseDescription,
        testCaseFunction,
        options: {
          batch: {
            items,
          },
        },
        config: {},
        runtime: 'nodejs',
        runtimeOptions: {
          browserCallbacks,
        },
      });
    };
  };

  const describe: XBellDescribe = (
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ) => {
    collector.collectGroup({
      groupDescription,
      testGroupFunction,
      config: {},
      runtimeOptions: {},
      options: {},
    });
  };

  describe.todo = (
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ) => {
    collector.collectGroup({
      groupDescription,
      testGroupFunction,
      config: {},
      runtimeOptions: {},
      options: {
        todo: true,
      },
    });
  };

  describe.skip = (
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ) => {
    collector.collectGroup({
      groupDescription,
      testGroupFunction,
      config: {},
      runtimeOptions: {},
      options: {
        skip: true,
      },
    });
  };

  describe.only = (
    groupDescription: string,
    testGroupFunction: XBellTestGroupFunction
  ) => {
    collector.collectGroup({
      groupDescription,
      testGroupFunction,
      config: {},
      runtimeOptions: {},
      options: {
        only: true,
      },
    });
  };

  test.describe = describe;

  test.mock = (mockPath: string, factory) => {
    if (mockPath.startsWith('.')) {
      const callSite = getCallSite();
      const callSiteFilename = callSite[1]!.getFileName()!;
      if (callSiteFilename) {
        mockPath = path.join(
          path.dirname(fileURLToPath(callSiteFilename)),
          mockPath
        );
      }
    }
    collector.collectMock(mockPath, factory);
  };

  test.extend = (
    nodejsCallback
  ) => {
    const callSite = getCallSite();
    const callSiteFilename = callSite[1]!.getFileName()!;
    return createTest(
      [
        ...nodejsCallbacks,
        {
          callback: nodejsCallback,
          filename: fileURLToPath(callSiteFilename),
          sortValue: getSortValue(),
        },
      ],
      browserCallbacks
    );
  };

  test.browser = createBrowserTest(browserCallbacks);

  test.all = createAllTest(commonCallbacks);

  test.extendBrowser = (browserCallback) => {
    const callSite = getCallSite();
    const callSiteFilename = callSite[1]!.getFileName()!;

    return createTest(
      [...nodejsCallbacks],
      [
        ...browserCallbacks,
        {
          callback: browserCallback,
          filename: fileURLToPath(callSiteFilename),
          sortValue: getSortValue(),
        },
      ],
      [...commonCallbacks]
    );
  };

  test.extendAll = (commonCallback) => {
    const callSite = getCallSite();
    const callSiteFilename = callSite[1]!.getFileName()!;

    return createTest(
      [...nodejsCallbacks],
      [...browserCallbacks],
      [
        ...commonCallbacks,
        {
          callback: commonCallback,
          filename: fileURLToPath(callSiteFilename),
          sortValue: getSortValue(),
        },
      ]
    );
  };

  return test;
}

export const test = createTest<NodeJSTestArguments, BrowserTestArguments, AllTestArguments>();

export const describe = test.describe;

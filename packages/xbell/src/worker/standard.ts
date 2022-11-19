import type {
  XBellTestCaseFunction,
  XBellTestGroupFunction,
  XBellTestCaseFunctionArguments,
  XBellBrowserTest,
  XBellTest,
  XBellDescribe,
  XBellBrowserCallback
} from '../types';
import * as path from 'node:path';
import { fileURLToPath } from '../utils/path';
import { collector } from './collector';
import { getCallSite } from '../utils/error';
import debug from 'debug';
import type { BrowserTestArguments } from '../browser-test/index';
import { getSortValue } from '../utils/sort';

const debugStandard = debug('xbell:standard');

export function createBrowserTest<BrowserExtArgs = {}>(
  browserCallbacks: XBellBrowserCallback[] = [],
): XBellBrowserTest<BrowserExtArgs> {
  const browser: XBellBrowserTest<BrowserExtArgs> = (caseDescription, testCaseFunction) => {
    const callSite = getCallSite();

    const callSiteFilename = callSite[1].getFileName()!;

    const _testFunctionFilename = fileURLToPath(callSiteFilename);

    debugStandard('_testFunctionFilename', _testFunctionFilename);

    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks,
      },
      config: {},
      options: {},
      _testFunctionFilename,
    });
  }

  browser.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription, testCaseFunction,
      options: {
        todo: true,
      },
      config: {},
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  browser.skip = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        skip: true,
      },
      config: {},
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  browser.only = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        only: true,
      },
      config: {},
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  browser.each = (items) => {
    return (caseDescriptionArg, testCaseFunction) => {
      for (const [index, item] of items.entries()) {
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item, index) : caseDescriptionArg;
        collector.collectCase({
          caseDescription,
          testCaseFunction,
          options: {
            each: {
              item,
              index
            },
          },
          config: {},
          runtime: 'browser',
          runtimeOptions: {
            browserCallbacks,
          },
        });
      }
    }
  }

  browser.batch = (items) => {
    return (caseDescription, testCaseFunction) => {
      collector.collectCase({
        caseDescription,
        testCaseFunction,
        options: {
          batch: {
            items,
          }
        },
        config: {},
        runtime: 'browser',
        runtimeOptions: {
          browserCallbacks,
        }
      });
    }
  }

  browser.mock = (mockPath: string, factory) => {
    if (mockPath.startsWith('.')) {
      const callSite = getCallSite();
      const callSiteFilename = callSite[1].getFileName()!;
      mockPath = path.join(
        path.dirname(
          fileURLToPath(callSiteFilename)
        ),
        mockPath
      );
    }
    collector.collectBrowserMock(mockPath, factory);
  }

  browser.extend = <T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellBrowserTest<BrowserExtArgs & Awaited<ReturnType<T>>> => {
    const callSite = getCallSite();

    const callSiteFilename = callSite[1]!.getFileName() ?? undefined;
    return createBrowserTest([
      ...browserCallbacks,
      {
        callback: browserCallback,
        filename: fileURLToPath(callSiteFilename!),
        sortValue: getSortValue(),
      }
    ]);
  };

  return browser;
}

export function createTest<NodeJSExtArgs = {}, BrowserExtArgs = {}> (
  nodejsCallbacks: Array<(...args: any[]) => any> = [],
  browserCallbacks: Array<XBellBrowserCallback> = [],
): XBellTest<NodeJSExtArgs, BrowserExtArgs> {
  const test: XBellTest<NodeJSExtArgs, BrowserExtArgs> = (
    caseDescription: string,
    testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>
  ) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'node',
      runtimeOptions: {
        browserCallbacks,
      },
      config: {},
      options: {}
    });
  };

  test.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription, testCaseFunction, 
      options: {
        todo: true,
      },
      config: {},
      runtime: 'node',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  test.skip = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        skip: true,
      },
      config: {},
      runtime: 'node',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  test.only = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        only: true,
      },
      config: {},
      runtime: 'node',
      runtimeOptions: {
        browserCallbacks
      }
    });
  }

  test.each = (items) => {
    return (caseDescriptionArg, testCaseFunction) => {
      items.forEach((item, index) => {
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item, index) : caseDescriptionArg;
        collector.collectCase({
          caseDescription,
          testCaseFunction,
          options: {
            each: {
              item,
              index,
            }
          },
          config: {},
          runtime: 'node',
          runtimeOptions: {
            browserCallbacks,
          },
        });
      })
    }
  }

  test.batch = (items) => {
    return (caseDescription, testCaseFunction) => {
      collector.collectCase({
        caseDescription,
        testCaseFunction,
        options: {
          batch: {
            items,
          }
        },
        config: {},
        runtime: 'node',
        runtimeOptions: {
          browserCallbacks,
        }
      });
    }
  }

  const describe: XBellDescribe = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
    collector.collectGroup({
      groupDescription,
      testGroupFunction,
      config: {},
      runtimeOptions: {},
      options: {},
    });
  };

  describe.todo = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
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


  describe.skip = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
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

  describe.only = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
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

  test.extend = <T extends (args: XBellTestCaseFunctionArguments<NodeJSExtArgs>) => any>(nodejsCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs> => {
    return createTest([
      ...nodejsCallbacks,
      nodejsCallback
    ], browserCallbacks)
  }

  
  test.browser = createBrowserTest(browserCallbacks);

  test.extendBrowser = (browserCallback) => {
    const callSite = getCallSite();
    const callSiteFilename = callSite[1]!.getFileName()!;

    return createTest([
      ...nodejsCallbacks,
    ], [
      ...browserCallbacks,
      {
        callback: browserCallback,
        filename: fileURLToPath(callSiteFilename),
        sortValue: getSortValue(),
      }
    ]);
  }

  test.mock = (mockPath: string, factory) => {
    if (mockPath.startsWith('.')) {
      const callSite = getCallSite();
      const callSiteFilename = callSite[1]!.getFileName()!;
      if (callSiteFilename) {
        mockPath = path.join(
          path.dirname(
            fileURLToPath(callSiteFilename)
          ),
          mockPath
        )
      }
    }
    collector.collectMock(mockPath, factory);
  }

  return test;
}

export const test = createTest<{}, BrowserTestArguments>();

export const describe = test.describe;

// export const mock = (mockPath: string, factory?: () => any) => {
// }
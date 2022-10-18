import type { XBellBrowserTestCaseFunction, XBellTestCaseFunction, XBellTestGroupFunction, XBellTestCaseFunctionArguments, FixtureFunction } from '../types';
import { collector } from './collector';

interface XBellBrowserTest<BrowserExtArgs = {}> {
  (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  only(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellBrowserTestCaseFunction & { item: T }) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<BrowserExtArgs & { item: T }>) => void;

  extend<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellBrowserTest<Awaited<ReturnType<T>>>;
}

interface XBellTest<NodeJSExtArgs = {}, BrowserExtArgs = {}> {
  /** group */
  describe(groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;

  only(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T }, BrowserExtArgs>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T }, BrowserExtArgs>) => void;

  browser: XBellBrowserTest<BrowserExtArgs>;

  extend<T extends (args: XBellTestCaseFunctionArguments<BrowserExtArgs>) => any>(nodeJSCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs>;
   /** case */
   (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  extendBrowser<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellTest<NodeJSExtArgs, Awaited<ReturnType<T>>>;
}

export function createBrowserTest<BrowserExtArgs = {}>(
  browserCallbacks: Array<(...args: any[]) => any> = [],
): XBellBrowserTest<BrowserExtArgs> {
  const browser: XBellBrowserTest<BrowserExtArgs> = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks,
      },
      config: {},
      options: {},
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
      items.forEach((item, index) => {
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item) : caseDescriptionArg;
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
      })
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

  browser.extend = <T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellBrowserTest<BrowserExtArgs & Awaited<ReturnType<T>>> => {
    return createBrowserTest([
      ...browserCallbacks,
      browserCallback,
    ]);
  };

  return browser;
}

export function createTest<NodeJSExtArgs = {}, BrowserExtArgs = {}> (
  nodejsCallbacks: Array<(...args: any[]) => any> = [],
  browserCallbacks: Array<(...args: any[]) => any> = [],
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
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item) : caseDescriptionArg;
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

  test.describe = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
    collector.collectGroup(groupDescription, testGroupFunction, {}, {});
  };


  test.extend = <T extends (args: XBellTestCaseFunctionArguments<NodeJSExtArgs>) => any>(nodejsCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs> => {
    return createTest([
      ...nodejsCallbacks,
      nodejsCallback
    ], browserCallbacks)
  }

  
  test.browser = createBrowserTest(browserCallbacks);

  test.extendBrowser = (browserCallback) => {
    return createTest([
      ...nodejsCallbacks,
    ], [
      ...browserCallbacks,
      browserCallback
    ]);
  }

  return test;
}

export const test = createTest<{}, {}>();

export const describe = test.describe;


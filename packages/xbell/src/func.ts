import type { XBellBrowserTestCaseFunction, XBellTestCaseFunction, XBellTestGroupFunction, XBellTestCaseFunctionArguments } from './types';
import { collector } from './worker/collector';

interface XBellBrowserTest<BrowserExtArgs = {}> {
  (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  only(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellBrowserTestCaseFunction & { item: T }) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<BrowserExtArgs & { item: T }>) => void;
}

interface XBellTest<NodeJSExtArgs = {}, BrowserExtArgs = {}> {
  /** group */
  describe(groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  extend<T extends (args: XBellTestCaseFunctionArguments<BrowserExtArgs>) => any>(nodeJSCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs>;
  extendBrowser<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellTest<NodeJSExtArgs, BrowserExtArgs & Awaited<ReturnType<T>>>;
   /** case */
   (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  only(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs, BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T }, BrowserExtArgs>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtArgs & { item: T }, BrowserExtArgs>) => void;

  browser: XBellBrowserTest<BrowserExtArgs>
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
      tagInfo: {
        tag: 'normal',
      }
    });
  };

  test.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription, testCaseFunction, 
      tagInfo: {
        tag: 'todo',
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
      tagInfo: {
        tag: 'skip',
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
      tagInfo: {
        tag: 'only',
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
      items.forEach((item) => {
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item) : caseDescriptionArg;
        collector.collectCase({
          caseDescription,
          testCaseFunction,
          tagInfo: {
            tag: 'each',
            options: {
              item,
            },
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
        tagInfo: {
          tag: 'batch',
          options: {
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

  test.extendBrowser = <T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellTest<NodeJSExtArgs, BrowserExtArgs & Awaited<ReturnType<T>>> => {
    return createTest(nodejsCallbacks, [
      ...browserCallbacks,
      browserCallback,
    ]);
  };

  test.extend = <T extends (args: XBellTestCaseFunctionArguments<NodeJSExtArgs>) => any>(nodejsCallback: T): XBellTest<NodeJSExtArgs & Awaited<ReturnType<T>>, BrowserExtArgs> => {
    return createTest([
      ...nodejsCallbacks,
      nodejsCallback
    ], browserCallbacks)
  }

  const browser: XBellBrowserTest<BrowserExtArgs> = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'browser',
      runtimeOptions: {
        browserCallbacks,
      },
      config: {},
      tagInfo: {
        tag: 'normal'
      }
    });
  }

  browser.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription, testCaseFunction, 
      tagInfo: {
        tag: 'todo',
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
      tagInfo: {
        tag: 'skip',
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
      tagInfo: {
        tag: 'only',
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
      items.forEach((item) => {
        const caseDescription = typeof caseDescriptionArg === 'function' ? caseDescriptionArg(item) : caseDescriptionArg;
        collector.collectCase({
          caseDescription,
          testCaseFunction,
          tagInfo: {
            tag: 'each',
            options: {
              item,
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
        tagInfo: {
          tag: 'batch',
          options: {
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

  test.browser = browser;


  return test;
}

export const test = createTest<{}, {}>();

export const describe = test.describe;

export { expell as expect } from 'expell';

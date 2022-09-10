import type { XBellBrowserTestCaseFunction, XBellTestCaseFunction, XBellTestGroupFunction, } from './types';
import { collector } from './worker/collector';

interface XBellBrowserTest<BrowserExtensionArg = {}> {
  (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtensionArg>): void;

  only(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtensionArg>): void;

  skip(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtensionArg>): void;

  todo(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtensionArg>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellBrowserTestCaseFunction & { item: T }) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<BrowserExtensionArg & { item: T }>) => void;
}

interface XBellTest<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> {
  /** group */
  describe(groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  extendBrowser<T extends (args: BrowserExtensionArg) => any>(browserCallback: T): XBellTest<NodeJSExtensionArg, BrowserExtensionArg & ReturnType<T>>;
   /** case */
   (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>): void;

  only(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>): void;

  skip(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>): void;

  todo(caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T) => string), testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg & { item: T }, BrowserExtensionArg>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg & { item: T }, BrowserExtensionArg>) => void;

  browser: XBellBrowserTest<BrowserExtensionArg>
}

export function createTest<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> (
  browserCallbacks: Array<(...args: any[]) => any> = [],
): XBellTest<NodeJSExtensionArg, BrowserExtensionArg> {
  const test: XBellTest<NodeJSExtensionArg, BrowserExtensionArg> = (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>) => {
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

  test.extendBrowser = <T extends (args: BrowserExtensionArg) => any>(browserCallback: T): XBellTest<NodeJSExtensionArg, BrowserExtensionArg & ReturnType<T>> => {
    return createTest([
      ...browserCallbacks,
      browserCallback,
    ]);
  };

  const browser: XBellBrowserTest<BrowserExtensionArg> = (caseDescription, testCaseFunction) => {
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

export const test = createTest();

export const describe = test.describe;
export { expell as expect } from 'expell';

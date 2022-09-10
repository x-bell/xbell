import type { XBellBrowserTestCaseFunction, XBellTestCaseFunction, XBellTestGroupFunction } from './types';
import { collector } from './worker/collector';

interface XBellTest<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> {
  /** case */
  (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>): void;
  /** group */
  describe(groupDescription: string, testGroupFunction: XBellTestGroupFunction): void;
  extendBrowser<T extends (args: BrowserExtensionArg) => any>(browserCallback: T): XBellTest<NodeJSExtensionArg, BrowserExtensionArg & ReturnType<T>>;
  browser(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction): void;
}

export function createTest<NodeJSExtensionArg = {}, BrowserExtensionArg = {}> (
  browserCallbacks: Array<(...args: any[]) => any> = [],
): XBellTest<NodeJSExtensionArg, BrowserExtensionArg> {
  const test: XBellTest<NodeJSExtensionArg, BrowserExtensionArg> = (caseDescription: string, testCaseFunction: XBellTestCaseFunction<NodeJSExtensionArg, BrowserExtensionArg>) => {
    collector.collectCase(caseDescription, testCaseFunction, {}, {
      browserCallbacks,
    });
  };

  test.describe = (groupDescription: string, testGroupFunction: XBellTestGroupFunction) => {
    collector.collectGroup(groupDescription, testGroupFunction, {}, {});
  };

  test.extendBrowser = <T extends (args: BrowserExtensionArg) => any>(browserCallback: T): XBellTest<NodeJSExtensionArg, BrowserExtensionArg & ReturnType<T>> => {
    return createTest([
      ...browserCallbacks,
      browserCallback,
    ]);
  };

  test.browser = (caseDescription, testCaseFunction) => {
    // TODO:
    collector.collectCase(caseDescription, testCaseFunction, {
      tag: 'browser',
    });
  }

  return test;
}

export const test = createTest();

export const describe = test.describe;
export { expell as expect } from 'expell';

// export {
//   expect,
// }

import type {
  XBellBrowserTest,
  XBellBrowserCallback,
} from '../types';
import * as path from 'node:path';
import { fileURLToPath } from '../utils/path';
import { collector } from './collector';
import { getCallSite } from '../utils/error';
import debug from 'debug';
import { getSortValue } from '../utils/sort';

const debugTestBrowser = debug('xbell:test-browser');

export function createBrowserTest<BrowserExtensionArguments = {}>(
  browserCallbacks: XBellBrowserCallback[] = [],
): XBellBrowserTest<BrowserExtensionArguments> {
  const browser: XBellBrowserTest<BrowserExtensionArguments> = (caseDescription, testCaseFunction) => {
    const callSite = getCallSite();

    const callSiteFilename = callSite[1].getFileName()!;

    const _testFunctionFilename = fileURLToPath(callSiteFilename);

    debugTestBrowser('_testFunctionFilename', _testFunctionFilename);

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

  browser.extend = <T extends (args: BrowserExtensionArguments) => any>(browserCallback: T): XBellBrowserTest<BrowserExtensionArguments & Awaited<ReturnType<T>>> => {
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

import type { XBellCommonCallback } from '../types';
import * as path from 'node:path';
import debug from 'debug';
import { fileURLToPath } from '../utils/path';
import { getCallSite } from '../utils/error';
import { collector } from './collector';
import { XBellAllTest } from '../types/test-all';
import { getSortValue } from '../utils/sort';

const debugTestAll = debug('xbell:test-all');

export function createAllTest<CommonExtensionArguments = {}>(
  commonCallbacks: XBellCommonCallback[] = [],
): XBellAllTest<CommonExtensionArguments> {
  const all: XBellAllTest<CommonExtensionArguments> = (caseDescription, testCaseFunction) => {
    const callSite = getCallSite();

    const callSiteFilename = callSite[1].getFileName()!;

    const _testFunctionFilename = fileURLToPath(callSiteFilename);

    debugTestAll('_testFunctionFilename', _testFunctionFilename);

    collector.collectCase({
      caseDescription,
      testCaseFunction,
      runtime: 'all',
      runtimeOptions: {
        commonCallbacks,
      },
      config: {},
      options: {},
      _testFunctionFilename,
    });
  }

  all.todo = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription, testCaseFunction,
      options: {
        todo: true,
      },
      config: {},
      runtime: 'all',
      runtimeOptions: {
        commonCallbacks
      }
    });
  }

  all.skip = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        skip: true,
      },
      config: {},
      runtime: 'all',
      runtimeOptions: {
        commonCallbacks
      }
    });
  }

  all.only = (caseDescription, testCaseFunction) => {
    collector.collectCase({
      caseDescription,
      testCaseFunction,
      options: {
        only: true,
      },
      config: {},
      runtime: 'all',
      runtimeOptions: {
        commonCallbacks
      }
    });
  }

  all.each = (items) => {
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
          runtime: 'all',
          runtimeOptions: {
            commonCallbacks,
          },
        });
      }
    }
  }

  all.batch = (items) => {
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
        runtime: 'all',
        runtimeOptions: {
          commonCallbacks,
        }
      });
    }
  }

  all.mock = (mockPath: string, factory) => {
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

  all.extend = <T extends (args: CommonExtensionArguments) => any>(browserCallback: T): XBellAllTest<CommonExtensionArguments & Awaited<ReturnType<T>>> => {
    const callSite = getCallSite();

    const callSiteFilename = callSite[1]!.getFileName() ?? undefined;
    return createAllTest([
      ...commonCallbacks,
      {
        callback: browserCallback,
        filename: fileURLToPath(callSiteFilename!),
        sortValue: getSortValue(),
      }
    ]);
  };

  return all;
}
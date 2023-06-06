import type { Page as PageInterface, Locator as LocatorInterface, FrameLocator as FrameLocatorInterface, XBellMocks, XBellBrowserCallback, XBellTestFile } from '../types';
import type { Browser, BrowserContext } from 'playwright-core';
import { Page, getLocatorByQueryItem } from './page';
import { lazyBrowser } from './browser';
import debug from 'debug';
import * as path from 'node:path';
import { configurator } from '../common/configurator';
import { pathManager } from '../common/path-manager';
import { workerContext } from './worker-context';
import type { LocatorMethod, LocatorSyncMethodKeys, PageSyncMethodKeys } from '../browser-test/types';

const debugLazyPage = debug('xbell:lazyPage');


const LOCATOR_SYNC_KEYS = new Set<LocatorSyncMethodKeys>([
  'first',
  'locator',
  'get',
  'getByClass',
  'getByTestId',
  'getByText',
  'getFrame',
  'nth',
  'last',
]);

const PAGE_SYNC_KEYS = new Set<PageSyncMethodKeys>([
  'locator',
  'get',
  'getByClass',
  'getByText',
  'getByTestId',
  'getFrame',
]);

// const SYNC_KEYS = new Set<keyof PageInterface | keyof LocatorInterface>([
//   'get',
//   'getByClass',
//   'getByClass',
//   'getByTestId',
//   'getByText',
//   'getFrame',
//   'first',
//   'last',
//   'nth'
// ]);

export function genLazyPage({
  browserCallbacks,
  browserMocks,
  file,
  filename,
}: {
  browserCallbacks: Array<XBellBrowserCallback>,
  browserMocks: XBellMocks,
  file: XBellTestFile,
  // callback loc
  filename: string,
}): PageInterface & { used: boolean } {
  const { projectName } = file;
  function genProxy(pagePropKey: 'mouse' | 'keyboard') {
    const proxy = new Proxy({}, {
      get(target, propKey: keyof Page[typeof pagePropKey]) {
        return (...args: any[]) => {
          return getLazyPage().then(({ page }) => {
            return Reflect.apply(page[pagePropKey][propKey] as Function, page[pagePropKey], args);
          });
        }
      }
    }) as Page[typeof pagePropKey];

    return proxy;
  }


  function genLazyLocator(queryItem: LocatorMethod) {
    const queryItems: LocatorMethod[] = [queryItem];
    const proxy = new Proxy({}, {
      get(target, propKey: string) {
        if (propKey === 'then') {
          return undefined;
        }

        return (...args: any) => {
          if (LOCATOR_SYNC_KEYS.has(propKey as LocatorSyncMethodKeys)) {
            queryItems.push({ method: propKey as LocatorSyncMethodKeys, args })
            return proxy;
          }

          return getLazyPage().then(({ page }) => {
           const locator= queryItems.reduce<LocatorInterface | FrameLocatorInterface | PageInterface>(
              (locator, queryItem) =>
                getLocatorByQueryItem(locator, queryItem),
                page,
            ) as LocatorInterface | FrameLocatorInterface;
            // @ts-ignore
            return Reflect.apply(locator[propKey], locator, args);
          });
        }
      }
    }) as LocatorInterface;
    return proxy;
  }

  let _lazyPage: Page;
  let _lazyContext: BrowserContext;
  let _lazyBrowser: Browser;
  let usedFlag = false;
  const getLazyPage = async () => {
    usedFlag = true;
    if (_lazyPage) {
      return {
        page: _lazyPage,
        context: _lazyContext,
        browser: _lazyBrowser,
      };
    }
    const projectConfig = await configurator.getProjectConfig({ projectName });
    const { debug } = projectConfig;
    const { headless, viewport, storageState, devtools, userAgent } = projectConfig.browser;
    const browser = await lazyBrowser.newBrowser('chromium', {
      headless: debug ? false : !!headless,
      devtools: debug ? true : !!devtools,
    });
    const videoDir = path.join(pathManager.tmpDir, 'videos');

    const browserContext = await browser.newContext({
      viewport,
      userAgent,
      recordVideo: {
        dir: videoDir,
        size: viewport,
      },
      storageState
    });
    _lazyContext = browserContext;
    _lazyBrowser = browser;
    _lazyPage = await Page.from({
      browserContext,
      browserCallbacks,
      mocks: browserMocks,
      filename,
      setupCallbacks: [],
      channel: workerContext.channel,
    })
    return {
      page: _lazyPage,
      context: _lazyContext,
      browser: _lazyBrowser
    };
  };

  const keyboardProxy = genProxy('keyboard');
  const mouseProxy = genProxy('mouse');

  const proxyPage = new Proxy({}, {
    get(target, propKey: keyof PageInterface | 'used') {
      debugLazyPage('get.propKey', propKey);
      if (propKey === 'used') {
        return usedFlag;
      }

      if (propKey === 'keyboard') {
        return keyboardProxy;
      }

      if (propKey === 'mouse') {
        return mouseProxy;
      }

      return (...args: any[]) => {
        if (PAGE_SYNC_KEYS.has(propKey as any)) {
          return genLazyLocator({ method: propKey as LocatorSyncMethodKeys, args: args as any });
        }

        // if (SYNC_KEYS.has(propKey)) {
        //   return new Proxy({}, {
        //     get(target, locatorKey: string) {
        //       // TODO: handle all keys that are not in the locator properties
        //       if (locatorKey === 'then') {
        //         return undefined;
        //       }
        //       return (...locatorArgs: any[]) => getLazyPage().then(({ page }) => {
        //         const locator = Reflect.apply(page[propKey], page, args);
        //         return Reflect.apply(locator[locatorKey], locator, locatorArgs);
        //       });
        //     }
        //   });
        // }
        // unuse page, don't trigger close
        if (propKey === 'close') {
          if (usedFlag) {
            return getLazyPage().then(async ({ page, context, browser }) => {
              await page.close();
              await context.close();
              await browser.close();
            })
          }
          return Promise.resolve();
        }

        return getLazyPage().then(({ page }) => {
          debugLazyPage('getLazyPage:then', propKey);
          return Reflect.apply(page[propKey], page, args);
        });
      }
    }
  }) as PageInterface & {
    used: boolean;
  };

  return proxyPage;
}

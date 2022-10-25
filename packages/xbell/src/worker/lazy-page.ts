import type { XBellPage, XBellLocator } from '../types';
import type { Browser, BrowserContext } from 'playwright-core';
import { Page } from './page';
import { lazyBrowser } from './browser';
import debug from 'debug';
import * as path from 'node:path';
import { configurator } from '../common/configurator';
import { pathManager } from '../common/path-manager';

const debugLazyPage = debug('xbell:lazyPage');


export function genLazyPage({
  browserCallbacks
}: {
  browserCallbacks: Array<(args: any) => any>
}): XBellPage & { used: boolean } {
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

    const { headless, viewport } = configurator.globalConfig.browser;
    const browser = await lazyBrowser.newContext('chromium', {
      headless: !!headless,
    });
    const videoDir = path.join(pathManager.tmpDir, 'videos');

    const browserContext = await browser.newContext({
      viewport,
      recordVideo: {
        dir: videoDir,
        size: viewport,
      }
    });
    _lazyContext = browserContext;
    _lazyBrowser = browser;
    _lazyPage = await Page.from(browserContext, browserCallbacks)
    return {
      page: _lazyPage,
      context: _lazyContext,
      browser: _lazyBrowser
    };
  };

  const keyboardProxy = genProxy('keyboard');
  const mouseProxy = genProxy('mouse');

  const proxyPage = new Proxy({}, {
    get(target, propKey: keyof XBellPage | 'used') {
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
        if (propKey.startsWith('getBy')) {
          return new Proxy({}, {
            get(target, locatorKey: string) {
              // TODO: handle all keys that are not in the locator properties
              if (locatorKey === 'then') {
                return undefined;
              }
              return (...locatorArgs: any[]) => getLazyPage().then(({ page }) => {
                const locator = Reflect.apply(page[propKey], page, args);
                return Reflect.apply(locator[locatorKey], locator, locatorArgs);
              });
            }
          });
        }
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
  }) as XBellPage & {
    used: boolean;
  };

  return proxyPage;
}

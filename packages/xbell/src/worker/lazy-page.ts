import { Page } from './page';
import { lazyBrowser } from './browser';
import type { XBellLocator, XBellPage } from '../types';
import debug from 'debug';
import type { Browser, BrowserContext } from 'playwright-core';

const debugLazyPage = debug('xbell:lazyPage');

export function genLazyPage(): XBellPage {
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

    const browser = await lazyBrowser.newContext('chromium', {
      headless: false,
    });
    const browserContext = await browser.newContext();
    _lazyContext = browserContext;
    _lazyBrowser = browser;
    _lazyPage = await Page.from(browserContext)
    return {
      page: _lazyPage,
      context: _lazyContext,
      browser: _lazyBrowser
    };
  };

  const proxyPage = new Proxy({}, {
    get(target, propKey: keyof XBellPage<any>) {
      debugLazyPage('get.propKey', propKey);
      return (...args: any[]) => {
        if (propKey.startsWith('locat')) {
          return new Proxy({}, {
            get(target, locatorKey: keyof XBellLocator) {
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
  }) as XBellPage<any>;

  return proxyPage;
}

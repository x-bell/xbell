import { Page } from './page';
import { lazyBrowser } from './browser';
import type { XBellLocator, XBellPage } from '../types';

export function genLazyPage(filename: string): XBellPage<any> {
  let _lazyPage: Page;
  const getLazyPage = async () => {
    if (_lazyPage) {
      return _lazyPage;
    }


    const browser = await lazyBrowser.newContext('chromium', {
      headless: false,
    });
    const browserContext = await browser.newContext();
    _lazyPage = await Page.from(browserContext, filename)

    return _lazyPage;
  };

  const proxyPage = new Proxy({}, {
    get(target, propKey: keyof XBellPage<any>) {
      return (...args: any[]) => {
        if (propKey.startsWith('locat')) {
          return new Proxy({}, {
            get(target, locatorKey: keyof XBellLocator) {
              return (...locatorArgs: any[]) => getLazyPage().then((lazyPage) => {
                const locator = Reflect.apply(lazyPage[propKey], _lazyPage, args);
                return Reflect.apply(locator[locatorKey], locator, locatorArgs);
              });
            }
          });
        }
        return getLazyPage().then((lazyPage) => {
          return Reflect.apply(lazyPage[propKey], _lazyPage, args);
        });
      }
    }
  }) as XBellPage<any>;

  return proxyPage;
}

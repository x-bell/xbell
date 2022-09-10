import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellPage, XBellLocator, XBellTestTask } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';


export class Executor {
  async run(file: XBellTestFile) {
    const { tasks } = file;
    for (const task of tasks) {
      if (task.type === 'group') {
        await this.runGroup(task);
      } else {
        await this.runCase(task);
      }
    }
  }

  async runGroup(group: XBellTestGroup) {
    for (const task of group.cases) {
      if (task.type === 'group') {
        await this.runGroup(task);
      } else {
        await this.runCase(task);
      }
    }
  }

  async runCase(c: XBellTestCase<any, any>) {
    if (c.runtime === 'node') {
      this.runCaseInNode(c);
    } else {
      this.runCaseInBrowser(c);
    }
  }

  async runCaseInNode(c: XBellTestCase<any, any>) {
    const { runtimeOptions, testFunction } = c;
    let _lazyPage: Page;
    const getLazyPage = async () => {
      if (_lazyPage) {
        return _lazyPage;
      }


      const browser = await lazyBrowser.newContext('chromium', {
        headless: false,
      });
      const browserContext = await browser.newContext();
      _lazyPage = await Page.from(browserContext, c.filename)

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
    }) as Page;

    const caseArgsProxy = new Proxy({}, {
      get(target, propKey) {
        if (propKey === 'page') {
          return proxyPage
        }
      }
    })

    workerContext.channel.emit('onCaseExecuteStart', {
      uuid: c.uuid,
    })

    try {
      await testFunction(caseArgsProxy);
      workerContext.channel.emit('onCaseExecuteSuccessed', {
        uuid: c.uuid,
      })
    } catch(err: any) {
      workerContext.channel.emit('onCaseExecuteFailed', {
        uuid: c.uuid,
        error: {
          message: err?.message || 'Run case error',
          name: err?.name || 'UnkonwError',
          stack: err?.stack,
        }
      })
    }
      

    // @ts-ignore
    if (_lazyPage) {
      await proxyPage.close();
    }
  }

  async runCaseInBrowser(c: XBellTestCase<any, any>) {
    const browser = await lazyBrowser.newContext('chromium', {
      headless: false,
    });

    const browserContext = await browser.newContext();
    const page = await Page.from(browserContext, c.filename)
    await page.evaluate(c.testFunction, {});
    await page.close();
    await browserContext.close();
    await browser.close();
  }
}

import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellPage, XBellLocator, XBellTestTask, XBellTestCaseStandard } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ClassicContext } from './classic-context';
import { genLazyPage } from './lazy-page';

function isStandardCase(c: any): c is XBellTestCaseStandard<any, any> {
  return typeof c.testFunction === 'function'
}

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
      // TODO:
      this.runCaseInBrowser(c as XBellTestCaseStandard<any, any>);
    }
  }

  protected getTestFunction(c: XBellTestCase<any, any>): Function {
    if (isStandardCase(c)) {
      return c.testFunction;
    } else {
      const ctx = new ClassicContext(c, genLazyPage(c.filename));
      const cls = ctx.createInstance(c.class as new() => any);
      return cls[c.propertyKey];
    }
  }

  async runCaseInNode(c: XBellTestCase<any, any>) {
    let wasUsedPage = false;
    const { runtimeOptions } = c;
    const testFunction = await this.getTestFunction(c);
    const lazyPage = genLazyPage(c.filename);
    
    const caseArgsProxy = new Proxy({}, {
      get(target, propKey) {
        if (propKey === 'page') {
          wasUsedPage = true;
          return lazyPage
        }
      }
    });

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
    if (wasUsedPage) {
      await lazyPage.close();
    }
  }

  async runCaseInBrowser(c: XBellTestCaseStandard<any, any>) {
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

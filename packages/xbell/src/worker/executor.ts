import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellPage, XBellLocator, XBellTestTask, XBellTestCaseStandard, XBellTestCaseClassic } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ArgumentManager } from './args';

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
    try {
      if (c.runtime === 'node') {
        this.runCaseInNode(c);
      } else {
        // TODO:
        this.runCaseInBrowser(c as XBellTestCaseStandard<any, any>);
      }
    } catch(error) {

    }
  }

  protected async runClassicCaseInNode(c: XBellTestCaseClassic) {
    const cls = c.class as new () => any;
    const instance = new cls();
    workerContext.channel.emit('onCaseExecuteStart', {
      uuid: c.uuid,
    });
    const argumentManger = new ArgumentManager();
    await instance[c.propertyKey](argumentManger.getArguments());

    workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid });
    
    await argumentManger.genCoverage();
    await argumentManger.terdown();
  }

  protected async runStandardCaseInNode(c: XBellTestCaseStandard<any, any>) {
    const { runtimeOptions, testFunction } = c;
    const argManager = new ArgumentManager();

    workerContext.channel.emit('onCaseExecuteStart', { uuid: c.uuid });

    await testFunction(argManager.getArguments());

    workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid });
    
    await argManager.genCoverage();
    await argManager.terdown();
  }

  async runCaseInNode(c: XBellTestCase<any, any>) {
    try {
      if (isStandardCase(c)) {
        await this.runStandardCaseInNode(c);
      } else {
        await this.runClassicCaseInNode(c);
      }
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
  }

  async runCaseInBrowser(c: XBellTestCaseStandard<any, any>) {
    const browser = await lazyBrowser.newContext('chromium', {
      headless: false,
    });

    const browserContext = await browser.newContext();
    const page = await Page.from(browserContext)
    await page.evaluate(c.testFunction, {});
    await page.close();
    await browserContext.close();
    await browser.close();
  }
}

import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellTestCaseStandard, XBellTestCaseClassic, XBellConfig, XBellProject } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ArgumentManager } from './args';
import { stateManager } from './state-manager';

function isStandardCase(c: any): c is XBellTestCaseStandard<any, any> {
  return typeof c.testFunction === 'function'
}

export class Executor {
  protected _project: XBellProject;
  constructor(protected _deps: {
    globalConfig: XBellConfig;
    projectName: XBellProjects['names']
  }) {
    this._project = _deps.globalConfig.projects!.find(project => project.name === _deps.projectName)!;
  }

  async run(file: XBellTestFile) {
    stateManager.setCurrentFilepath(file.filename);
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
        await this.runCaseInNode(c);
      } else {
        // TODO:
        await this.runCaseInBrowser(c as XBellTestCaseStandard<any, any>);
      }
    } catch(error) {

    }
  }

  protected async runClassicCaseInNode(c: XBellTestCaseClassic, argManager: ArgumentManager) {
    const cls = c.class as new () => any;
    const instance = new cls();
    await instance[c.propertyKey](argManager.getArguments());
  }

  protected async runStandardCaseInNode(c: XBellTestCaseStandard<any, any>, argManager: ArgumentManager) {
    const { runtimeOptions, testFunction } = c;

    await testFunction(argManager.getArguments());
  }

  async runCaseInNode(c: XBellTestCase<any, any>) {
    const argManager = new ArgumentManager();
    workerContext.channel.emit('onCaseExecuteStart', {
      uuid: c.uuid,
    });
    try {
      if (isStandardCase(c)) {
        await this.runStandardCaseInNode(c, argManager);
      } else {
        await this.runClassicCaseInNode(c, argManager);
      }
      const coverage = await argManager.genCoverage();
      workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, coverage });
    } catch(err: any) {
      workerContext.channel.emit('onCaseExecuteFailed', {
        uuid: c.uuid,
        error: {
          message: err?.message || 'Run case error',
          name: err?.name || 'UnkonwError',
          stack: err?.stack,
        }
      })
    } finally {
      await argManager.terdown();
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

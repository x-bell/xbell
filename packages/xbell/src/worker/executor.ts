import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellTestCaseStandard, XBellTestCaseClassic, XBellConfig, XBellProject } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ArgumentManager } from './argument-manager';
import { stateManager } from './state-manager';
import { configurator } from '../common/configurator';
import { pathManager } from '../common/path-manager';
import path, { join } from 'path';
import debug from 'debug';
import { htmlReporter } from '../common/html-reporter';
import * as url from 'url';
import * as fs from 'fs';
// import { Page as PWPage } from 'playwright-core';
// import { getSortValue } from '../utils/sort';

// const p: PWPage;

// const next = await p.evaluateHandle(() => {
//   return {
//     key: 'value'
//   }
// });

// next.evaluateHandle(({ key }, { a }) => {
//   return {
//     ...args
//   }
// }, { a: 'k' })
const __filename = url.fileURLToPath(import.meta.url);

const debugExecutor = debug('xbell:executor');

function isStandardCase(c: any): c is XBellTestCaseStandard<any, any> {
  return typeof c.testFunction === 'function'
}

export class Executor {
  protected _project: XBellProject;
  constructor(protected _deps: {
    globalConfig: XBellConfig;
    projectName: XBellProjects['name']
  }) {
    this._project = _deps.globalConfig.projects!.find(project => project.name === _deps.projectName)!;
  }

  async run(file: XBellTestFile) {
    stateManager.setCurrentFile(file);
    const { tasks } = file;

    for (const task of tasks) {
      if (task.type === 'group') {
        await this.runGroup(task, file);
      } else {
        await this.runCase(task, file);
      }
    }
  }

  async runGroup(group: XBellTestGroup, file: XBellTestFile) {
    for (const task of group.cases) {
      if (task.type === 'group') {
        await this.runGroup(task, file);
      } else {
        await this.runCase(task, file);
      }
    }
  }

  async runCase(c: XBellTestCase<any, any>, file: XBellTestFile) {
    const hasSelfSkipOrTodo = c.options.skip || c.options.todo;
    const hasSelfOnly = c.options.only;
    const hasOthersOnly = file.options.only > 0;
    if (hasSelfSkipOrTodo || (hasOthersOnly && !hasSelfOnly)) {
      if (c.options.todo)
        workerContext.channel.emit('onCaseExecuteTodo', { uuid: c.uuid });
      else
        workerContext.channel.emit('onCaseExecuteSkipped', { uuid: c.uuid })

      return;
    }

    if (c.runtime === 'node') {
      await this.runCaseInNode(c, file);
    } else {
      // TODO:
      await this.runCaseInBrowser(c as XBellTestCaseStandard<any, any>, file);
    }
  }

  protected async runClassicCaseInNode(c: XBellTestCaseClassic, argManager: ArgumentManager) {
    const cls = c.class as new () => any;
    const instance = new cls();
    const batchItems = c.options.batch?.items;
    if (Array.isArray(batchItems)) {
      for (const [index, item] of batchItems.entries()) {
        const args = argManager.getArguments();
        await instance[c.propertyKey]({
          ...args,
          item,
          index,
        });
      }
    } else {
      await instance[c.propertyKey](argManager.getArguments());
    }
  }

  protected async runStandardCaseInNode(c: XBellTestCaseStandard<any, any>, argManager: ArgumentManager) {
    const { runtimeOptions, testFunction, options } = c;
    const batchItems = options.batch?.items;

    if (Array.isArray(batchItems)) {
      for (const [index, item] of batchItems.entries()) {
        const args = argManager.getArguments();
        await testFunction({
          ...args,
          item,
          index,
        });
      }
    } else {
      await testFunction(argManager.getArguments());
    }
  }

  async runCaseInNode(c: XBellTestCase<any, any>, file: XBellTestFile) {
    const argManager = new ArgumentManager(file, c);
    const { hooks } = configurator.getProjectConfig({ projectName: file.projectName });
    workerContext.channel.emit('onCaseExecuteStart', {
      uuid: c.uuid,
    });
    try {
      if (typeof hooks.beforeEach === 'function') {
        await hooks.beforeEach(argManager.getArguments());
      }
      if (isStandardCase(c)) {
        await this.runStandardCaseInNode(c, argManager);
      } else {
        await this.runClassicCaseInNode(c, argManager);
      }
      if (typeof hooks.afterEach === 'function') {
        await hooks.afterEach(argManager.getArguments());
      }
      const coverage = await argManager.genCoverage();
      const pageResult = await argManager.terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, coverage, videos });
    } catch(err: any) {
      const pageResult = await argManager.terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;

      workerContext.channel.emit('onCaseExecuteFailed', {
        uuid: c.uuid,
        error: {
          message: err?.message || 'Run case error',
          name: err?.name || 'UnknowError',
          stack: err?.stack,
        },
        videos,
      });
    }
  }

  async runCaseInBrowser(c: XBellTestCaseStandard<any, any>, file: XBellTestFile) {
    // case config
    const projectConfig = configurator.getProjectConfig({ projectName: file.projectName })
    const { viewport, headless, storageState, devServer } = projectConfig.browser;
    const { coverage: coverageConfig } = projectConfig;
    const videoDir = join(pathManager.tmpDir, 'videos');

    const browser = await lazyBrowser.newBrowser('chromium', {
      headless: !!headless,
    });
    workerContext.channel.emit('onCaseExecuteStart', {
      uuid: c.uuid,
    });

    // ensureDir(videoDir);
    const browserContext = await browser.newContext({
      viewport,
      recordVideo: {
        size: viewport,
        dir: videoDir,
      },
      storageState,
    });
    const page = await Page.from({
      browserContext,
      setupCalbacks: [
        {
          callback: async () => {
            // @ts-ignore
            const { expect, fn, spyOn, importActual, page } = await import('xbell/browser');
            return {
              expect,
              fn,
              spyOn,
              importActual,
              page
            };
          },
          filename: __filename,
          sortValue: 0,
        },
      ],
      browserCallbacks: c.runtimeOptions.browserCallbacks || [],
      mocks: c.browserMocks,
      filename: c._testFunctionFilename!,
      needToSetupExpose: true,
      channel: workerContext.channel,
    });
    const terdown = async () => {
      const video = await page.video();
      if (video) {
        const filepath = await video.path();
        await page.close();
        await browserContext.close();
        await browser.close();
        return {
          videoPath: htmlReporter.saveAsset(filepath),
        }
      } else {
        await page.close();
        await browserContext.close();
        await browser.close();
      }
    }

    try {
      // A tentative decision
      // debugExecutor('page.goto');
      await page.goto('https://xbell.test', {
        mockHTML: devServer.html.content ?? (devServer.html.path != null ? fs.readFileSync(devServer.html.path, 'utf-8') : ''),
      });
      // debugExecutor('page.goto.end', page.evaluate);
      if (Array.isArray(c.options.batch?.items)) {
        for (const [index, item] of c.options.batch!.items.entries()) {
          // @ts-ignore
          const batchContext = await page.evaluateHandle((args, { item, index }) => {
            return {
              ...args,
              item,
              index,
            };
          }, { item, index });
          await batchContext.evaluate(c.testFunction); 
        }
      } else if (c.options.each) {
        const { index, item } = c.options.each!;
        // @ts-ignore
        const eachContext = await page.evaluateHandle((args, { item, index }) => {
          return {
            ...args,
            item,
            index,
          };
        }, { item, index });
        await eachContext.evaluateHandle(c.testFunction);
      } else {
        await page.evaluate(c.testFunction); 
      }
      // debugExecutor('page.evaluate.end');
      const coverage = coverageConfig?.enabled ? await page.evaluate(() => {
        return window.__xbell_coverage__;
      }) : undefined;
      const pageResult = await terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, videos, coverage });
      
    } catch(err: any) {
      // debugExecutor('page.err', err);
      const pageResult = await terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      workerContext.channel.emit('onCaseExecuteFailed', {
        uuid: c.uuid,
        browserTestFunction: c._testFunctionFilename ? {
          filename: c._testFunctionFilename,
          body: c.testFunction.toString(),
        } : undefined,
        error: {
          message: err?.message || 'Run case error',
          name: err?.name || 'UnkonwError',
          stack: err?.stack,
        },
        videos,
      });
    }
  }
}

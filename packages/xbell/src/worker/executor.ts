import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellTestCaseStandard, XBellTestCaseClassic, XBellConfig, XBellProject, BrowserTestArguments } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ArgumentManager } from './argument-manager';
import { stateManager } from './state-manager';
import { configurator } from '../common/configurator';
import { pathManager } from '../common/path-manager';
import path, { join } from 'path';
import debug from 'debug';
import WebSocket from 'ws';
import { htmlReporter } from '../common/html-reporter';
import * as url from 'url';
import * as fs from 'fs';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';

const __filename = url.fileURLToPath(import.meta.url);
const debugExecutor = debug('xbell:executor');

function isStandardCase(c: any): c is XBellTestCaseStandard<any> {
  return typeof c.testFunction === 'function'
}

async function executePage({
  page,
  port,
  execute
}: {
  page: Page;
  port: number;
  execute: () => Promise<void>;
}) {
  let isViteReload = false;
  page._viteAssetReload = () => {
    isViteReload = true;
  };

  const ws = new WebSocket(`ws://localhost:${port}/${XBELL_BUNDLE_PREFIX}/`, 'vite-hmr')
  ws.addEventListener('message', ({ data }) => {
    data = JSON.parse(data as string);
    if ((data as any)?.type === 'full-reload') {
      isViteReload = true;
    }
    debugExecutor('===ws:msg===', data);
  });

  await execute().catch((ret) => {
    if (!isViteReload) {
      return Promise.reject(ret);
    }
  });

  ws.removeAllListeners();
  ws.close();

  if (isViteReload) {
    await page.reload();
    await executePage({
      page,
      execute,
      port,
    });
  }
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


    switch (c.runtime) {
      case 'nodejs':
        await this.runCaseInNode(c, file);
        break;
      case 'browser':
        await this.runCaseInBrowser(c as XBellTestCaseStandard<any>, file);
        break;
      case 'all':
      default:
        await this.runCaseInAll(c as XBellTestCaseStandard<any>, file);
        break;
    }
  }

  protected async runClassicCaseInNode(c: XBellTestCaseClassic, argManager: ArgumentManager) {
    // Currently, there are no callbacks
    const { runtimeOptions } = c;
    const cls = c.class as new () => any;
    const instance = new cls();
    const batchItems = c.options.batch?.items;
    let args = argManager.getArguments();

    // get args
    for (const { callback } of runtimeOptions?.nodejsCallbacks || []) {
      args = await callback(args);
    }

    if (Array.isArray(batchItems)) {
      for (const [index, item] of batchItems.entries()) {
        await instance[c.propertyKey]({
          ...args,
          item,
          index,
        });
      }
    } else {
      await instance[c.propertyKey](args);
    }
  }

  protected async runStandardCaseInNode(c: XBellTestCaseStandard<any>, argManager: ArgumentManager) {
    const { runtimeOptions, testFunction, options } = c;
    const batchItems = options.batch?.items;
    let args = argManager.getArguments();

    // get args
    for (const { callback } of runtimeOptions.nodejsCallbacks || []) {
      args = await callback(args);
    }

    if (Array.isArray(batchItems)) {
      for (const [index, item] of batchItems.entries()) {
        await testFunction({
          ...args,
          item,
          index,
        });
      }
    } else {
      await testFunction(args);
    }
  }

  async runCaseInNode(c: XBellTestCase<any, any>, file: XBellTestFile) {
    const argManager = new ArgumentManager(file, c);
    const { hooks } = await configurator.getProjectConfig({ projectName: file.projectName });
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

  // only support standard in browser
  async runCaseInBrowser(c: XBellTestCaseStandard<any>, file: XBellTestFile) {
    // case config
    const projectConfig = await configurator.getProjectConfig({ projectName: file.projectName });
    const globalConfig = configurator.globalConfig;
    const { viewport, headless, storageState, devtools } = projectConfig.browser;
    const { url, html } = projectConfig.browserTest;
    const { coverage: coverageConfig } = projectConfig;
    const videoDir = join(pathManager.tmpDir, 'videos');
    const browser = await lazyBrowser.newBrowser('chromium', {
      headless: !!headless,
      devtools: !!devtools,
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
    const project = globalConfig.projects!.find(project => project.name === file.projectName)!;
    debugExecutor('browser-project', project);
    const page = await Page.from({
      browserContext,
      project,
      setupCallbacks: [
        {
          callback: async () => {
            // @ts-ignore
            const { expect, fn, spyOn, importActual, page, sleep } = (await import('xbell/browser-test')) as typeof import('../browser-test');
            const basicArgs: BrowserTestArguments = {
              expect,
              fn,
              spyOn,
              importActual,
              page,
              sleep,
              runtime: 'browser',
              project: window.__xbell_context__.project!,
            };
            return basicArgs;
          },
          filename: __filename,
          sortValue: 0,
        },
      ],
      browserCallbacks: c.runtimeOptions.browserCallbacks || [],
      mocks: c.browserMocks,
      filename: c._testFunctionFilename!,
      channel: workerContext.channel,
    });

    await page._setupExpose();
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
      const { port } = await workerContext.channel.request('queryServerPort');
      // A tentative decision
      // debugExecutor('page.goto');
      await page.goto(url ?? 'https://xbell.test', {
        mockHTML: html?.content ?? (html?.path != null ? fs.readFileSync(html?.path, 'utf-8') : ''),
      });
      // debugExecutor('page.goto.end', page.evaluate);
      if (Array.isArray(c.options.batch?.items)) {
        for (const [index, item] of c.options.batch!.items.entries()) {
         await executePage({
          page,
          port,
          execute: async() => {
            if (index === 0) await page._setupBrowserEnv();
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
         })
        }
      } else if (c.options.each) {
        const { index, item } = c.options.each!;
        await executePage({
          page,
          execute: async () => {
            if (index === 0) await page._setupBrowserEnv();
            // @ts-ignore
            const eachContext = await page.evaluateHandle((args, { item, index }) => {
              return {
                ...args,
                item,
                index,
              };
            }, { item, index });
            await eachContext.evaluateHandle(c.testFunction);
          },
          port,
        });
      } else {
        await executePage({
          page,
          execute: async () => {
            await page._setupBrowserEnv();
            await page.evaluate(c.testFunction);
          },
          port,
        });
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

  // only support standard in all
  async runCaseInAll(c: XBellTestCaseStandard<any>, file: XBellTestFile) {
    await this.runCaseInBrowser(c, file);
    await this.runCaseInNode(c, file);
  }
}

import type { XBellTestCase, XBellTestFile, XBellTestGroup, XBellTestCaseStandard, XBellTestCaseClassic, XBellConfig, XBellProject, BrowserTestArguments } from '../types';
import { Page } from './page';
import { lazyBrowser } from './browser';
import { workerContext } from './worker-context';
import { ArgumentManager } from './argument-manager';
import { stateManager } from './state-manager';
import { configurator } from '../common/configurator';
import { pathManager } from '../common/path-manager';
import { join } from 'path';
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
  execute
}: {
  page: Page;
  execute: () => Promise<void>;
}) {
  await execute();
}

// TODO: temp
interface RunCaseOptions {
  isFromAll?: boolean;
  ignoreEmitStatus?: boolean;
}

interface RunCaseResult {
  status: 'failed' | 'successed';
  videos?: string[];
  coverage?: any;
  error?: any;
}
export class Executor {
  protected _project: XBellProject;
  constructor(protected _deps: {
    globalConfig: XBellConfig;
    projectName: XBellProjects['name']
  }) {
    this._project = _deps.globalConfig.projects!.find(project => project.name === _deps.projectName)!;
  }

  emitBrowserError({
    case: c,
    error,
    videos
  }: {
    case: XBellTestCaseStandard<any>,
    error: any;
    videos?: string[]
  }) {
    workerContext.channel.emit('onCaseExecuteFailed', {
      uuid: c.uuid,
      browserTestFunction: c._testFunctionFilename ? {
        filename: c._testFunctionFilename,
        body: c.testFunction.toString(),
      } : undefined,
      error: {
        message: error?.message || 'Run case error',
        name: error?.name || 'UnkonwError',
        stack: error?.stack,
      },
      videos,
    });
  }

  emitNodeJSError({
    case: c,
    error,
    videos,
  }: {
    case: XBellTestCaseStandard<any>,
    error: any;
    videos?: string[]
  }) {
    workerContext.channel.emit('onCaseExecuteFailed', {
      uuid: c.uuid,
      error: {
        message: error?.message || 'Run case error',
        name: error?.name || 'UnknowError',
        stack: error?.stack,
      },
      videos,
    });
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

  protected async runClassicCaseInNode(c: XBellTestCaseClassic, argManager: ArgumentManager, runCaseOptions: RunCaseOptions = {}) {
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

  protected async runStandardCaseInNode(c: XBellTestCaseStandard<any>, argManager: ArgumentManager, runCaseOptions: RunCaseOptions = {}) {
    const { isFromAll } = runCaseOptions;
    const { runtimeOptions, testFunction, options } = c;
    const batchItems = options.batch?.items;
    const callbacks = (isFromAll ? runtimeOptions.commonCallbacks : runtimeOptions.nodejsCallbacks) ?? [];
    let args = argManager.getArguments();

    // get args
    for (const { callback } of callbacks) {
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

  async runCaseInNode(c: XBellTestCase<any, any>, file: XBellTestFile, runCaseOptions: RunCaseOptions = {}): Promise<RunCaseResult> {
    const { ignoreEmitStatus } = runCaseOptions
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
        await this.runStandardCaseInNode(c, argManager, runCaseOptions);
      } else {
        await this.runClassicCaseInNode(c, argManager, runCaseOptions);
      }
      if (typeof hooks.afterEach === 'function') {
        await hooks.afterEach(argManager.getArguments());
      }
      const coverage = await argManager.genCoverage();
      const pageResult = await argManager.terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      if (!ignoreEmitStatus) {
        workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, coverage, videos });
      }
      return {
        status: 'successed',
      }
    } catch(error: any) {
      const pageResult = await argManager.terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      if (!ignoreEmitStatus) {
        this.emitNodeJSError({
          videos,
          error,
          case: c as XBellTestCaseStandard<any>,
        });
      }
      return {
        status: 'failed',
        videos,
        error,
      }
    }
  }

  // only support standard in browser
  async runCaseInBrowser(c: XBellTestCaseStandard<any>, file: XBellTestFile, runCaseOptions: RunCaseOptions = {}): Promise<RunCaseResult> {
    const { isFromAll, ignoreEmitStatus } = runCaseOptions;
    // case config
    const projectConfig = await configurator.getProjectConfig({ projectName: file.projectName });
    const globalConfig = configurator.globalConfig;
    const { debug } = projectConfig;
    const { viewport, headless, storageState, devtools } = projectConfig.browser;
    const { url, html } = projectConfig.browserTest;
    const { coverage: coverageConfig } = projectConfig;
    const videoDir = join(pathManager.tmpDir, 'videos');
    const browser = await lazyBrowser.newBrowser('chromium', {
      headless: debug ? false : !!headless,
      devtools: debug ? true : !!devtools,
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
    const browserSetup = {
      callback: async () => {
        // @ts-ignore
        window.process = { env: {} };
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
    };
    const page = await Page.from({
      browserContext,
      project,
      setupCallbacks: debug ? [{
          callback: () => {
            return new Promise(resolve => setTimeout(resolve, 1000));
          },
          filename: __filename,
          sortValue: 0,
        },
        browserSetup,
      ] : [
        browserSetup
      ],
      browserCallbacks: (isFromAll ? c.runtimeOptions.commonCallbacks : c.runtimeOptions.browserCallbacks) || [],
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
        });
      } else {
        await executePage({
          page,
          execute: async () => {
            await page._setupBrowserEnv();
            await page.evaluate(c.testFunction);
          },
        });
      }
      // debugExecutor('page.evaluate.end');
      const coverage = coverageConfig?.enabled ? await page.evaluate(() => {
        return window.__xbell_coverage__;
      }) : undefined;
      const pageResult = await terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      if (!ignoreEmitStatus) {
        workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, videos, coverage });
      }

      return {
        status: 'successed',
        videos,
        coverage,
      }
      
    } catch(error: any) {
      // debugExecutor('page.err', err);
      const pageResult = await terdown();
      const videos = pageResult?.videoPath ? [pageResult.videoPath] : undefined;
      if (!ignoreEmitStatus) {
        this.emitBrowserError({
          error,
          videos,
          case: c,
        });
      }

      return {
        status: 'failed',
        videos,
        error,
      };
    }
  }

  // only support standard in all
  async runCaseInAll(c: XBellTestCaseStandard<any>, file: XBellTestFile) {
    try {
      const runCaseOptions: RunCaseOptions = { isFromAll: true, ignoreEmitStatus: true };
      const nodeJSRunCaseResult = await this.runCaseInNode(c, file, runCaseOptions);
      const browserRunCaseResult = await this.runCaseInBrowser(c, file, runCaseOptions) ?? {};
      // TODO: compose all runtime status
      if (nodeJSRunCaseResult.status === 'successed' && browserRunCaseResult.status === 'successed') {
        // successed
        workerContext.channel.emit('onCaseExecuteSuccessed', { uuid: c.uuid, videos: browserRunCaseResult.videos, coverage: browserRunCaseResult.coverage });
      } else {
        // failed
        if (nodeJSRunCaseResult.status === 'failed') {
          this.emitNodeJSError({
            case: c,
            error: nodeJSRunCaseResult.error,
            videos: nodeJSRunCaseResult.videos,
          });
          return;
        }

        this.emitBrowserError({
          case: c,
          error: browserRunCaseResult.error,
          videos: browserRunCaseResult.videos,
        });
      }
    } catch (error) {
      // TODO: unhandle error
    }
  }
}

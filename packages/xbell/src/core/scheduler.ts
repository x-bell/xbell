
// import type { XBellLogger } from '../common/logger';
// import { Executor } from '../executor/executor';
// import { Worker } from 'node:worker_threads';

import type { XBellWorkerTask, XBellProject } from '../types';
import { configurator } from '../common/configurator';
import { cpus } from 'node:os';
import { workerPool, XBellWorkerItem, XBellTaskQuque } from './worker-pool';
import { recorder } from './recorder';
import { browserBuilder } from './browser-builder';
import { compiler } from '../compiler/compiler';
import debug from 'debug';

const debugScheduler = debug('xbell:scheduler');
export interface XBellScheduler  {
  runTest(): Promise<void>
}

export interface XBellSchedulerConstructor {
  new (): XBellScheduler;
}

export class Scheduler {
  async setup() {
  }

  protected setupWorker = (worker: XBellWorkerItem) => {
     // requests
     worker.channel.registerRoutes({
      // async queryModuleUrl(modules) {
      //   const server = await browserBuilder.server;
      //   return Promise.all(modules.map(async (modulePath) => ({
      //     url:(await server.pluginContainer.resolveId(modulePath))?.id as string,
      //     path: modulePath,
      //   })))
      // },
      async transformBrowserCode({ code: sourceCode }) {
        const { code, map } = await compiler.compileBrowserCode(sourceCode);
        debugScheduler('transform-browser', {
          code,
          map,
          sourceCode,
        });
        return {
          code,
          map,
        }
      },
      async transformHtml({ html, url }) {
        // const server = await browserBuilder.server;
        // const finalHtml = await server.transformIndexHtml(url, html);
        return { html };
      },
      async queryServerPort() {
        const { port } = await browserBuilder.server;
        return {
          port,
        }
      },
      async queryModuleUrls(modules: string[]) {
        const server = await browserBuilder.server;
        return Promise.all(modules.map(async (modulePath) => ({
          url: await server.queryUrl(modulePath),
          path: modulePath,
        })));
      },
      async queryModuleId({
        modulePath,
        importer
      }) {
        const server = await browserBuilder.server;
        return await server.queryId(modulePath, importer) ?? null;
      }
    });

    // events
    worker.channel.addListener('onLog', (...args) => recorder.onLog(...args))
    worker.channel.addListener('onFileCollectSuccesed', (...args) => recorder.onFileCollectSuccesed(...args));
    worker.channel.addListener('onFileCollectFailed', (...args) => recorder.onFileCollectFailed(...args));
    worker.channel.addListener('onCaseExecuteTodo', (...args) => recorder.onCaseExecuteTodo(...args))
    worker.channel.addListener('onCaseExecuteSkipped', (...args) => recorder.onCaseExecuteSkipped(...args))
    worker.channel.addListener('onCaseExecuteStart', (...args) => recorder.onCaseExecuteStart(...args))
    worker.channel.addListener('onCaseExecuteSuccessed', (...args) => recorder.onCaseExecuteSuccessed(...args))
    worker.channel.addListener('onCaseExecuteFailed', (...args) => recorder.onCaseExecuteFailed(...args))
  }

  async run(list: {
    project: XBellProject;
    testFiles: string[];
  }[]) {
    debugScheduler('list', list);
    workerPool.setupWorker = this.setupWorker;
    const multiProjectTasks = list.map<XBellTaskQuque>(({ project, testFiles }) => {
      const tasks: XBellWorkerTask[] = testFiles.map((testFilename) => ({
        type: 'run',
        payload: {
          testFiles: [{
            filepath: testFilename,
            projectName: project.name,
          }],
        },
      }));
      return {
        tasks,
        projectName: project.name,
      }
    });

    workerPool.setup({
      maxThreads: configurator.globalConfig.maxThreads,
      queueList: multiProjectTasks,
    });

    await workerPool.runAllTasks();
  }
}

export const scheduler = new Scheduler()

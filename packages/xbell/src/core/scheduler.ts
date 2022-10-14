
// import type { XBellLogger } from '../common/logger';
// import { Executor } from '../executor/executor';
// import { Worker } from 'node:worker_threads';

import type { XBellWorkerTask } from '../types';
import { configurator } from '../common/configurator';
import { workerPool } from './worker-pool';
import { recorder } from './recorder';
import { browserBuilder } from './browser-builder';
import { pathManager } from './path-manager';
import { compiler } from '../compiler/compiler';

export interface XBellScheduler  {
  runTest(): Promise<void>
}

export interface XBellSchedulerConstructor {
  new (): XBellScheduler;
}

export class Scheduler {
  async setup() {
    const { workers } = workerPool;
    workers.forEach((worker) => {
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
          const { code } = await compiler.compileBrowserCode(sourceCode);
          return {
            code,
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
        }
      })

      // events
      worker.channel.addListener('onLog', (...args) => recorder.onLog(...args))
      worker.channel.addListener('onFileCollectSuccesed', (...args) => recorder.onFileCollectSuccesed(...args))
      worker.channel.addListener('onFileCollectFailed', (...args) => recorder.onFileCollectFailed(...args))
      worker.channel.addListener('onCaseExecuteStart', (...args) => recorder.onCaseExecuteStart(...args))
      worker.channel.addListener('onCaseExecuteSuccessed', (...args) => recorder.onCaseExecuteSuccessed(...args))
      worker.channel.addListener('onCaseExecuteFailed', (...args) => recorder.onCaseExecuteFailed(...args))
    });
  }

  async run(testFiles: string[]) {
    const globalConfig = await configurator.globalConfig;
    const tasks: XBellWorkerTask[] = testFiles.map((testFilename) => ({
      type: 'run',
      payload: {
        globalConfig,
        testFilenames: [testFilename],
      },
    }));
    workerPool.addTasks(tasks);
    await workerPool.runAllTasks();
  }
}

export const scheduler = new Scheduler()

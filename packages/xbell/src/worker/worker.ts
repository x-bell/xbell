import { MessagePort, parentPort } from 'node:worker_threads';
import type { XBellTestFile, XBellConfig, XBellWorkerData, XBellWorkerTaskPayload, XBellWorkerTask, XBellWorkerUpdateTaskMessage } from '../types';
import type { XBellLogger } from '../common/logger';
import { Executor } from './executor';
import { collector } from './collector';
import { workerContext } from './worker-context';
import { toTestFileRecord } from '../utils/record';
import debug from 'debug';
import { configurator } from '../common/configurator';

const debugWorker = debug('xbell:worker');

export async function run(taskPayload: XBellWorkerTaskPayload) {
  const testFiles = (await Promise.all(taskPayload.testFiles.map(async ({ filepath, projectName }) => {
    try {
      debugWorker('startCollect', filepath);
      const ret = await collector.collect({
        filename: filepath,
        projectName,
      });
      const testRecord = toTestFileRecord(ret);
      workerContext.channel.emit('onFileCollectSuccesed', testRecord);
      debugWorker('startCollect.done', filepath, testRecord);
      return ret;
    } catch(error: any) {
      debugWorker('startCollect.failed', filepath);
      // TODO: collect failed
      workerContext.channel.emit('onFileCollectFailed', {
        projectName,
        filename: filepath,
        logs: [],
        tasks: [],
        error: {
          name: error?.name || 'ExecuteFileError',
          message: error?.message || 'Unknow Error',
          stack: error?.stack,
        },
      });
    }
  }))).filter(Boolean) as XBellTestFile[];

  for (const testFile of testFiles) {
    workerContext.setCurrentTestFile(testFile);
    const executor = new Executor({
      projectName: testFile.projectName,
      globalConfig: configurator.globalConfig,
    }); 
    await executor.run(testFile);
  }
}

async function setup() {
  workerContext.setup();
  await configurator.setup()
}

parentPort!.on('message', async ({ type, payload }: XBellWorkerTask) => {
  if (type === 'run') {
    await setup();
    await run(payload);
    parentPort?.postMessage({
      type: 'finished',
    });
  }
});

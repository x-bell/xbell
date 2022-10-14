import { MessagePort, parentPort } from 'node:worker_threads';
import type { XBellTestFile, XBellConfig, XBellWorkerData, XBellWorkerTaskPayload, XBellWorkerTask, XBellWorkerUpdateTaskMessage } from '../types';
import type { XBellLogger } from '../common/logger';
import { Executor } from './executor';
import { collector } from './collector';
import { workerContext } from './worker-context';
import { toTestFileRecord } from '../utils/record';
import debug from 'debug';

const debugWorker = debug('xbell:worker');
export async function run(workData: XBellWorkerTaskPayload) {
  const testFiles = (await Promise.all(workData.testFilenames.map(async (filename) => {
    try {
      debugWorker('startCollect', filename);
      const ret = await collector.collect(filename);
      const testRecord = toTestFileRecord(ret);
      workerContext.channel.emit('onFileCollectSuccesed', testRecord);
      debugWorker('startCollect.done', filename, testRecord);
      return ret;
    } catch(error: any) {
      debugWorker('startCollect.failed', filename);
      // TODO: collect failed
      workerContext.channel.emit('onFileCollectFailed', {
        filename,
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
      projectName:  workerContext.workerData.projectName,
      globalConfig: workerContext.workerData.globalConfig,
    }); 
    await executor.run(testFile);
  }
}



parentPort!.on('message', async ({ type, payload }: XBellWorkerTask) => {
  if (type === 'run') {
    await run(payload);
    parentPort?.postMessage({
      type: 'finished',
    });
  }
});

import { MessagePort, parentPort } from 'node:worker_threads';
import type { XBellTestFile, XBellConfig, XBellWorkerData, XBellWorkerTaskPayload, XBellWorkerTask, XBellWorkerUpdateTaskMessage } from '../types';
import type { XBellLogger } from '../common/logger';
import { Executor } from './executor';
import { collector } from './collector';
import { workerContext } from './worker-context';
import { toTestFileRecord } from '../utils/record';
// console.log('workerContext22', String(workerContext));
// const data = workerData as XBellWorkerData;

export async function run(workData: XBellWorkerTaskPayload) {
  const testFiles = (await Promise.all(workData.testFilenames.map(async (filename) => {
    try {
      const ret = await collector.collect(filename);
      workerContext.channel.emit('onFileCollectSuccesed', toTestFileRecord(ret))
      return ret;
    } catch(error: any) {
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
      })
    }
  }))).filter(Boolean) as XBellTestFile[]
  for (const testFile of testFiles) {
    workerContext.setCurrentTestFile(testFile);
    const executor = new Executor(); 
    await executor.run(testFile);
  }
}



parentPort!.on('message', async ({ type, payload }: XBellWorkerTask) => {
  if (type === 'run') {
    await run(payload);
  }
});

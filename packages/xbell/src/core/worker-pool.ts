import type {
  XBellWorkerTask,
  XBellWorkerData,
} from '../types';

import { Worker, MessageChannel, isMainThread } from 'node:worker_threads';
// import type { MessagePort } from 'node:worker_threads';
import { cpus } from 'node:os';
import { Channel } from '../common/channel';
import { pathManager } from './path-manager';

interface XBellWorkerItem {
  worker: Worker;
  busy: boolean;
  workerId: number;
  channel: Channel;
}

export class WorkerPool {
  protected queue: XBellWorkerTask[] = []
  public workers: XBellWorkerItem[] = [];

  constructor(
    public workPath: string,
    public threads = cpus().length,
  ) {
    this.workers = this.genWorkers();
  }

  protected genWorkers(): XBellWorkerItem[] {
    // const { workerPort } = this.channel;
    return Array.from(new Array(this.threads), (_, idx) => {
      const { port1: mainPort, port2: workerPort } = new MessageChannel();
      const channel = new Channel(mainPort);

      const workerId = idx + 1;
      return {
        worker: new Worker(this.workPath, {
          transferList: [workerPort],
          workerData: <XBellWorkerData>{
            port: workerPort,
            workerId,
          },
        }),
        busy: false,
        workerId,
        channel,
      }
    });
  }

  public addTasks(tasks: XBellWorkerTask[]) {
    this.queue = [
      ...this.queue,
      ...tasks,
    ];
  }

  public runAllTasks() {
    return new Promise<void>((resolve, reject) => {
      this.checkQueue(resolve, reject);
    })
  }

  protected checkQueue(resolve: () => void, reject: () => void) {
    if (!this.queue.length) {
      const isAllFinished = this.workers.every(worker => !worker.busy)
      if (isAllFinished) {
        // TODO:
        resolve();
        console.log('work-pool:exit');
        // process.exit();
      }
      return;
    }

    const idleWorkerItems = this.workers.filter(worker => !worker.busy)
    for (const workerItem of idleWorkerItems) {
      if (!this.queue.length) {
        return;
      }
      const worker = workerItem.worker;
      workerItem.busy = true;
      worker.once('message', () => {
        this.finishedTask(workerItem, resolve, reject);
      });
      worker.once('error', () => {
        this.finishedTask(workerItem, resolve, reject);
      });
      const task = this.queue.shift();
      worker.postMessage(task);
    }
  }

  public finishedTask(workerItem: XBellWorkerItem, resolve: () => void, reject: () => void) {
    workerItem.worker.removeAllListeners('message');
    workerItem.worker.removeAllListeners('error');
    workerItem.busy = false;
    this.checkQueue(resolve, reject);
  }
}

export const workerPool = new WorkerPool(pathManager.workerPath);
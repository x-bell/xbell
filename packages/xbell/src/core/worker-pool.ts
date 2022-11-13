import type { XBellWorkerTask, XBellWorkerData, XBellProject } from '../types';

import { Worker, MessageChannel, isMainThread } from 'node:worker_threads';
// import type { MessagePort } from 'node:worker_threads';
import { Channel } from '../common/channel';
import { pathManager } from '../common/path-manager';
import { configurator } from '../common/configurator';
import debug from 'debug';

const debugWorkerPool = debug('xbell:workerPool');
export interface XBellWorkerItem {
  worker: Worker;
  busy: boolean;
  workerId: number;
  channel: Channel;
  projectName: string;
}

export interface XBellTaskQuque {
  projectName: string;
  tasks: XBellWorkerTask[];
}

export class WorkerPool {
  protected _workerId = 0;
  public workers: XBellWorkerItem[] = [];
  public maxThreads!: number;
  public queueList: XBellTaskQuque[] = [];
  public setupWorker?: (workerItem: XBellWorkerItem) => void;
  protected _promise?: {
    resolve: (v: void) => void;
    reject: () => void;
  };

  constructor(public workPath: string) {}

  public setup({
    maxThreads,
    queueList,
  }: {
    maxThreads: number;
    queueList: XBellTaskQuque[];
  }) {
    this.maxThreads = maxThreads;
    this.queueList = queueList;
    // let restThreads = maxThreads;
    for (const { tasks, projectName } of this.queueList) {
      const worker = this.genWorker({ projectName });
      this.workers!.push(worker);
      if (this.workers.length === this.maxThreads) break;
    }
  }

  public runAllTasks() {
    return new Promise((resolve, reject) => {
      this._promise = {
        resolve,
        reject,
      };
      this.checkQueue();
    });
  }

  protected genWorker({
    projectName,
  }: {
    projectName: string;
  }): XBellWorkerItem {
    const { port1: mainPort, port2: workerPort } = new MessageChannel();
    const channel = new Channel(mainPort);
    const workerId = ++this._workerId;
    const workerItem = {
      projectName,
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
    };

    this.setupWorker!(workerItem);
    return workerItem;
  }

  protected isEmptyQuque() {
    return this.queueList.every((item) => !item.tasks.length);
  }

  protected checkQueue() {
    if (this.isEmptyQuque()) {
      return;
    }
    const nextQuque = this.queueList.find((item) => item.tasks.length);
    if (nextQuque) {
      const task = nextQuque.tasks.shift()!;
      this.runTask({ task, projectName: nextQuque.projectName });
    }
  }

  protected runTask({
    projectName,
    task,
  }: {
    task: XBellWorkerTask;
    projectName: string;
  }) {
    const workers = this.workers!;
    const idleWorker = workers.find(
      (worker) => !worker.busy && worker.projectName === projectName
    );
    if (idleWorker) {
      this.executeWorker({
        workerItem: idleWorker,
        task,
      });
    } else if (workers.length < this.maxThreads) {
      const newWorker = this.genWorker({ projectName });
      this.workers!.push(newWorker);
      this.executeWorker({
        workerItem: newWorker,
        task,
      });
    }
  }

  protected executeWorker({
    workerItem,
    task,
  }: {
    workerItem: XBellWorkerItem;
    task: XBellWorkerTask;
  }) {
    const { worker } = workerItem;
    workerItem.busy = true;
    worker.once('message', (event) => {
      if (event?.type === 'finished') {
        debugWorkerPool('finishedTask');
        this.finishedTask(workerItem);
      }
    });
    worker.once('error', (err) => {
      console.log(
        'An untractable error was encountered, please report it to https://github.com/x-bell/xbell/issues'
      );
      console.log(err);
      process.exit(0);
      // this.finishedTask(workerItem, resolve, reject);
    });
    // const task = this.queue.shift();
    debugWorkerPool('remove queue', task);
    worker.postMessage(task);
    this.checkQueue();
  }

  public async finishedTask(workerItem: XBellWorkerItem) {
    workerItem.worker.removeAllListeners('message');
    workerItem.worker.removeAllListeners('error');
    workerItem.busy = false;
    const targetQueue = this.queueList.find(
      (queue) => queue.projectName === workerItem.projectName
    )!;

    if (!targetQueue.tasks.length) {
      await workerItem.worker.terminate();
      this.workers = this.workers!.filter((item) => item !== workerItem);
    }

    if (this.isEmptyQuque() && this.workers!.every(workerItem => !workerItem.busy)) {
      this._promise?.resolve();
    } else {
      this.checkQueue();
    }
  }
}

export const workerPool = new WorkerPool(pathManager.workerPath);

import type { XBellWorkerTask, XBellWorkerData, XBellProject } from '../types';
import color from '@xbell/color';
import { Worker, MessageChannel, isMainThread } from 'node:worker_threads';
// import type { MessagePort } from 'node:worker_threads';
import { Channel } from '../common/channel';
import { pathManager } from '../common/path-manager';
import { configurator } from '../common/configurator';
// import { configurator } from '../common/configurator';
// import debug from 'debug';

// const debugWorkerPool = debug('xbell:workerPool');
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

  protected projectSetupMap = new Map<string, Promise<any>>();

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

  protected isEmptyQueue() {
    return this.queueList.every((item) => !item.tasks.length);
  }

  protected checkQueue() {
    if (this.isEmptyQueue()) {
      return;
    }
    const nextQuque = this.queueList.find((item) => item.tasks.length);
    if (nextQuque) {
      this.runTask({ queue: nextQuque });
    }
  }

  protected async runTask({
    queue,
  }: {
    queue: XBellTaskQuque;
  }) {

    const { projectName } = queue;
    const workers = this.workers;
    const idleWorker = workers.find(
      (worker) => !worker.busy && worker.projectName === projectName
    );
    if (idleWorker) {
      this.executeWorker({
        workerItem: idleWorker,
        queue,
      });
    } else if (workers.length < this.maxThreads) {
      const newWorker = this.genWorker({ projectName });
      this.workers.push(newWorker);
      this.executeWorker({
        workerItem: newWorker,
        queue,
      });
    }
  }

  protected async runProjectSetup({ projectName }: { projectName: string }) {
    if (!this.projectSetupMap.has(projectName)) {
      const project = configurator.globalConfig.projects.find(project => project.name === projectName)!;
      const setup = project.config?.setup;
      const callbackReturnValue = configurator.runConfigSetup(setup);
      this.projectSetupMap.set(projectName, callbackReturnValue);
      if (typeof setup === 'function') {
        console.log(
          color.cyan(`${projectName ? `[${projectName}] ` : ''}Running setup...`)
        );
      }
      await callbackReturnValue
    }
    return this.projectSetupMap.get(projectName);
  }

  protected async executeWorker({
    workerItem,
    queue,
  }: {
    workerItem: XBellWorkerItem;
    queue: XBellTaskQuque;
  }) {
    const { worker } = workerItem;
    workerItem.busy = true;
    worker.once('message', (event) => {
      if (event?.type === 'finished') {
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
    const task = queue.tasks.shift();
    await this.runProjectSetup({ projectName: queue.projectName });
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
      this.workers = this.workers.filter((item) => item !== workerItem);
    }

    if (this.isEmptyQueue() && this.workers.every(workerItem => !workerItem.busy)) {
      this._promise?.resolve();
    } else {
      this.checkQueue();
    }
  }
}

export const workerPool = new WorkerPool(pathManager.workerPath);

import type {
  XBellWorkerTask,
  XBellWorkerData,
  XBellProject,
} from '../types';

import { Worker, MessageChannel, isMainThread } from 'node:worker_threads';
// import type { MessagePort } from 'node:worker_threads';
import { cpus } from 'node:os';
import { Channel } from '../common/channel';
import { pathManager } from './path-manager';
import { configurator } from '../common/configurator';
import debug from 'debug';

const debugWorkerPool = debug('xbell:workerPool');
interface XBellWorkerItem {
  worker: Worker;
  busy: boolean;
  workerId: number;
  channel: Channel;
}

export class WorkerPool {
  protected queue: XBellWorkerTask[] = []
  public workers!: XBellWorkerItem[];

  constructor(
    public workPath: string,
    // public threads = cpus().length,
  ) {}

  async setup() {
    const { globalConfig } = configurator;
    const projects = globalConfig.projects!
    this.workers = this.genWorkers(projects);
  }

  protected genWorkers(projects: XBellProject[]): XBellWorkerItem[] {
    // const { workerPort } = this.channel;
    return projects.map((project, idx) => {
      const { port1: mainPort, port2: workerPort } = new MessageChannel();
      const channel = new Channel(mainPort);

      const workerId = idx + 1;
      return {
        worker: new Worker(this.workPath, {
          transferList: [workerPort],
          workerData: <XBellWorkerData>{
            port: workerPort,
            workerId,
            globalConfig: configurator.globalConfig,
            projectName: project.name,
          },
        }),
        busy: false,
        workerId,
        channel,
      }
    });
  }

  protected checkQueue(resolve: () => void, reject: () => void) {
    // const hasTask = Object.entries(this.queueMap).some(([_, tasks]) => tasks.length)

    if (!this.queue.length) {
      const isAllFinished = this.workers.every(worker => !worker.busy)
      if (isAllFinished) {
        // TODO:
        resolve();
        debugWorkerPool('exit');
      }
      return;
    }

    const idleWorkerItems = this.workers.filter(worker => !worker.busy)
    for (const workerItem of idleWorkerItems) {
      if (!this.queue.length) {
        return;
      }
      const { worker } = workerItem;
      workerItem.busy = true;
      worker.once('message', (event) => {
        if (event?.type === 'finished') {
          debugWorkerPool('finishedTask');
          this.finishedTask(workerItem, resolve, reject);
        }
      });
      worker.once('error', (err) => {
        console.log('An untractable error was encountered, please report it to https://github.com/x-bell/xbell/issues');
        console.log(err);
        process.exit(0);
        // this.finishedTask(workerItem, resolve, reject);
      });
      const task = this.queue.shift();
      debugWorkerPool('remove queue', task);
      worker.postMessage(task);
    }
  }

  addTasks(tasks: XBellWorkerTask[]) {
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

  public finishedTask(workerItem: XBellWorkerItem, resolve: () => void, reject: () => void) {
    workerItem.worker.removeAllListeners('message');
    workerItem.worker.removeAllListeners('error');
    workerItem.busy = false;
    this.checkQueue(resolve, reject);
  }
}

export const workerPool = new WorkerPool(pathManager.workerPath);

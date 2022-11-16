import type { XBellTestFile, XBellWorkerData, XBellWorkerLog, XBellProject } from '../types';

import { workerData as wd, parentPort } from 'node:worker_threads';
import { Console } from 'node:console';
import { Writable } from 'node:stream';
import { Channel } from '../common/channel';
import { configurator } from '../common/configurator';


class WorkerContext {
  workerData = wd as XBellWorkerData;
  channel!: Channel;
  currentTestFile?: XBellTestFile;
  projectName?: string;

  constructor() {
  }

  setup () {
    this.channel = new Channel(wd.port);
    this.initConsole();
  }

  setCurrentTestFile(testFile: XBellTestFile) {
    this.currentTestFile = testFile;
  }

  protected initConsole() {
    const stdout = new Writable({
      write: (chunk, encoding, callback) => {
        if (this.currentTestFile) {
          const logItem: XBellWorkerLog & {
            filename: string
          } = {
            filename: this.currentTestFile.filename,
            type: 'stdout',
            content: String(chunk),
          };
          this.currentTestFile.logs.push(logItem);
          this.channel.emit('onLog', logItem);
        }
        callback();
      },
    });
  
    const stderr = new Writable({
      write: (chunk, endcode, callback) => {
        if (this.currentTestFile) {
          const logItem: XBellWorkerLog & {
            filename: string
          } = {
            filename: this.currentTestFile.filename,
            type: 'stderr',
            content: String(chunk),
          };
          this.currentTestFile.logs.push();
          this.channel.emit('onLog', logItem);
        }
        callback();
      }
    })
  
    globalThis.console = new Console({
      stdout,
      stderr,
      colorMode: true,
    });
  }

  getProject(): XBellProject {
    return configurator.globalConfig.projects.find(projct => projct.name === this.projectName)!;
  }
}

export const workerContext = new WorkerContext();

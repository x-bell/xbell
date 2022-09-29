import type { MessagePort } from 'node:worker_threads';
import type { XBellConfig } from './config';

export interface XBellWorkerTaskPayload {
  globalConfig: XBellConfig;
  testFilenames: string[];
}

export interface XBellWorkerTask {
  type: 'run';
  payload: XBellWorkerTaskPayload;
}

export interface XBellWorkerData {
  port: MessagePort;
  workerId: number;
  globalConfig: XBellConfig;
  projectName: XBellProjects['names'];
}

import type { MessagePort } from 'node:worker_threads';
import type { XBellConfig } from './config';

export interface XBellWorkerTaskPayload {
  testFiles: { filepath: string; projectName: string }[];
}

export interface XBellWorkerTask {
  type: 'run';
  payload: XBellWorkerTaskPayload;
}

export interface XBellWorkerData {
  port: MessagePort;
  workerId: number;
}

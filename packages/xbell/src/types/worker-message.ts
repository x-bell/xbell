import type { XBellTestFileRecord, XBellTestTaskRecord } from './test';

export type XBellWorkerUpdateFileMessage = {
  tag: 'workerUpdateFile';
  request: Partial<XBellTestFileRecord> & {
    filename: string;
  }
  response: void
}

export type XBellWorkerCollectTestFileMessage = {
  tag: 'workerCollectFile';
  request: XBellTestFileRecord;
  response: void;
}

export type XBellWorkerUpdateTaskMessage = {
  tag: 'workerUpdateTask';
  request: Partial<XBellTestTaskRecord> & { uuid: string }
  response: void;
}

export type XBellWorkerCollectTestFileFailedMessage = {
  tag: 'workerCollectFileFailed';
  request: XBellTestFileRecord;
}

export type XBellWorkerQueryModuleUrl = {
  tag: 'workerQueryModuleUrl';
  request: string[];
  response: object;
}

export type XBellWorkerFileExecuteUnknowErrorMessage = {
  tag: 'workerFileExecuteUnknowError';
  request: {
    name?: string;
    message: string;
    stack?: string[];
  };
  response: void;
}

export type XBellWorkerMessage =
  | XBellWorkerCollectTestFileMessage
  | XBellWorkerUpdateFileMessage
  | XBellWorkerUpdateTaskMessage
  | XBellWorkerFileExecuteUnknowErrorMessage
  | XBellWorkerQueryModuleUrl;

export type XBellWorkerMessagePayload<T extends XBellWorkerMessage = XBellWorkerMessage> = {
  request: {
    type: 'request'
    uuid: number;
    data: T['request']
    tag: T['tag']
  }
  response: {
    type: 'response'
    uuid: number;
    data: T['response']
    tag: T['tag']
  }
}

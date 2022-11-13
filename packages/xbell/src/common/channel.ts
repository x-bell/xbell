import type { XBellTestFileRecord, XBellWorkerLog, XBellWorkerLifecycle } from '../types';
import type { MessagePort } from 'node:worker_threads';
import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';

import debug from 'debug';

const debugChannel = debug('xbell:channel');

type XBellWorkerRequestId = string;

interface XBellWorkerMessageCommon {
  type: 'request' | 'response' | 'event'
  payload: any;
}

interface XBellWorkerRequests {
  queryModuleUrls(modules: string[]): Promise<{ url: string | undefined; path: string }[]>;
  queryModuleId(option: {
    modulePath: string;
    importer?: string;
  }): Promise<string | null>;
  transformBrowserCode(data: { code: string; }): Promise<{ code: string; }>;
  queryServerPort(): Promise<{ port: number }>;
  transformHtml(data: { html: string; url: string }): Promise<{ html: string }>;
}

interface XBellWorkerRequestMessage extends XBellWorkerMessageCommon {
  type: 'request';
  payload: {
    api: keyof XBellWorkerRequests;
    data: any;
    requestId: XBellWorkerRequestId;
  };
}

interface XBellWorkerResponseMessage extends XBellWorkerMessageCommon {
  type: 'response';
  payload: {
    api: keyof XBellWorkerRequests;
    data: any;
    requestId: XBellWorkerRequestId;
  };
}

interface XBellWorkerEventMessage extends XBellWorkerMessageCommon {
  type: 'event';
  payload: {
    eventName: keyof XBellWorkerLifecycle;
    args: any;
  };
}

type XBellWorkerMessage =
  | XBellWorkerResponseMessage
  | XBellWorkerRequestMessage
  | XBellWorkerEventMessage;

// type PromiseValues<T> = {
//   [Key in keyof T]: T[Key] extends (...args: any) => any ?  ReturnType<T[Key]>
// }

export class Channel extends EventEmitter {
  protected _requestPromiseMap = new Map<XBellWorkerRequestId, { resolve: (arg: any) => void, reject: (arg: any) => void }>();
  protected _router?: XBellWorkerRequests;
  constructor(protected port: MessagePort) {
    super();
    this.port.addListener('message', (...args) => this.handleMessage(...args));
  }

  protected handleMessage(message: XBellWorkerMessage) {
    switch (message.type) {
      case 'event':
        return this.handleEvent(message);
      case 'request':
        return this.handleRequest(message);
      case 'response':
        return this.handleResponse(message);
      throw new Error('Unknow worker message');
    }
  }

  protected async handleRequest(message: XBellWorkerRequestMessage) {
    const { requestId, api, data } = message.payload;
    if (!this._router || !this._router![api]) {
      throw new Error('Unregistered route');
    }

    const ret = await this._router![api]!(data);

    // send response
    const responseMessage: XBellWorkerResponseMessage = {
      type: 'response',
      payload: {
        api,
        requestId,
        data: ret,
      }
    };
    this.port.postMessage(responseMessage);
  }

  protected handleResponse(message: XBellWorkerResponseMessage) {
    const { requestId, data, api } = message.payload;
    const promise = this._requestPromiseMap.get(requestId);
    if (!promise) {
      throw new Error(`The request [${api}] has already been processed.`);
    }

    promise.resolve(data);

    this._requestPromiseMap.delete(requestId);
  }

  protected handleEvent({ payload }: XBellWorkerEventMessage) {
    super.emit(payload.eventName, payload.args);
  }

  public registerRoutes(router: XBellWorkerRequests) {
    this._router = router;
  }

  public addListener<T extends keyof XBellWorkerLifecycle>(
    eventName: T,
    listener: (...args: Parameters<XBellWorkerLifecycle[T]>) => void
  ): this {
    return super.addListener(eventName, listener as any);
  }

  public emit<T extends keyof XBellWorkerLifecycle>(eventName: T, args: Parameters<XBellWorkerLifecycle[T]>[0]): boolean {
    const eventMessage: XBellWorkerEventMessage = {
      type: 'event',
      payload: {
        eventName,
        args,
      }
    }
    this.port.postMessage(eventMessage);
    return true;
  }

  request<T extends keyof XBellWorkerRequests>(
    api: T,
    data?: Parameters<XBellWorkerRequests[T]>[0]
  ): Promise<Awaited<ReturnType<XBellWorkerRequests[T]>>> {
    const requestId = randomUUID();
    const payload = {
      api,
      data,
      requestId,
    };
    const message: XBellWorkerRequestMessage = {
      type: 'request',
      payload: payload,
    };
    this.port.postMessage(message);
    debugChannel('request', payload);
    return new Promise((resolve, reject) => {
      this._requestPromiseMap.set(requestId, {
        resolve,
        reject
      });
    });
  }
}

// const workerChannel = new WorkerChannel();

// workerChannel.addListener('onCaseFailed', (file) => {

// })

// workerChannel.registerRoutes({
//   queryModuleUrl() {
//     return ['nihao']
//   }
// })
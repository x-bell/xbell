import type {
  XBellWorkerMessage,
  XBellWorkerMessagePayload,
} from '../types/worker-message';
import { MessagePort } from 'node:worker_threads';

interface XBellBasicRequestBody {
  type: 'request';
  tag: string;
  data: object;
  uuid: number;
}

// interface XBellChannel {
//   request(data: XBellBasicRequestBody): Promise<any>
// }

let uuid = 1;
function genUuid() {
  return uuid++;
}

function isRequest<T extends XBellWorkerMessage>(v: any): v is XBellWorkerMessagePayload<T>['request'] {
  return v?.type === 'request' && v.uuid && v.tag;
}

function isResponse<T extends XBellWorkerMessage>(v: any): v is XBellWorkerMessagePayload<T>['response'] {
  return v?.type === 'response' && v.uuid && v.tag;
}

interface Router {
  tag: XBellWorkerMessage['tag'];
  handler: (request: XBellWorkerMessage['request']) => XBellWorkerMessage['response'];
}

export class Channel {
  protected routes: Router[];

  constructor(protected port: MessagePort) {
    this.routes = []
    port.on('message', async (body) => {
      if (isRequest(body)) {
        const target = this.routes.find(route => route.tag === body.tag)
        if (target) {
          const res = await target.handler(body.data);
          port.postMessage(<XBellWorkerMessagePayload['response']>{
            ...body,
            type: 'response',
            data: res,
          })
        }
      }
    })
  }

  request(requestPayload: Omit<XBellWorkerMessagePayload['request'], 'uuid' | 'type'>) {
    return new Promise((resolve) => {
      const uuid = genUuid();
      const requestBody: XBellWorkerMessagePayload['request'] = {
        ...requestPayload,
        type: 'request',
        uuid,
      };

      const responseHandler = (response: any) => {
        if (isResponse(response) && response.uuid === uuid) {
          resolve(response.data);
          this.port.removeListener('message', responseHandler);
        }
      };
      this.port.on('message', responseHandler);
      this.port.postMessage(requestBody);
      // TODO: timeout reject
    });
  }
  
  route<T extends XBellWorkerMessage>(
    tag: T['tag'],
    handler: (args: T['request']) => (Promise<T['response']> | T['response'])
  ) {
    this.routes.push({
      tag,
      handler,
    });
  }
}

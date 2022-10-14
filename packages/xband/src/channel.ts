import WebSocket from 'ws';
import type { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';
import { EventEmitter } from 'node:events';
import type {
  Session as SessionInterface,
  Channel as ChannelInterface,
  ChannelEvent,
  ChannelFactory as ChannelFactoryInterface,
  ChannelResponse,
  ChannelDependencies,
  // SessionDependencies,
  // SessionFactory
} from './types';
import { debug } from './utils/debug';

const debugChannelRequest = debug('channel::request >>');
const debugChannelResponse = debug('channel::response <<')
const debugChannelEvent = debug('channel::event')

interface ChannelPromise {
  resolve(args: ChannelResponse<any>): void;
  reject(args: unknown): void;
  error: Error;
  method: string;
}

type ChannelOnMessage = (message: WebSocket.Data) => void;
type ChannelOnClose = () => void;

function isChannelRespnose(v: any): v is ChannelResponse<any> {
  return !!v?.id;
}

function isChannelEvent(v: any): v is ChannelEvent<any> {
  return !!v?.method;
}

export const ChannelFactory = <ChannelFactoryInterface>class Channel extends EventEmitter implements ChannelInterface {
  static async create(deps : ChannelDependencies): Promise<Channel> {
    const channle = new Channel(deps);
    await channle.setup()
    return channle;
  }

  sessions: Map<string, SessionInterface> = new Map<string, SessionInterface>()

  protected _promiseMap = new Map<number, ChannelPromise>()
  // protected _sessionPromiseMap = new Map<string>();
  protected _ws: WebSocket;

  constructor(protected _deps: ChannelDependencies) {
    super();

    this._ws = new WebSocket(_deps.url, [], {
      followRedirects: true,
      perMessageDeflate: false,
      maxPayload: 256 * 1024 * 1024, // 256Mb
      headers: {
        'User-Agent': `Xpeer 0.1.0`,
      },
    });
  }


  async setup(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ws.addEventListener('message', event => {
        // if (onMessage) {
        //   onMessage(event.data);
        // }
        const data = JSON.parse(event.data as string) as ChannelEvent<any> | ChannelResponse<any>;
        if (data.sessionId && !this.sessions.has(data.sessionId)) {
          throw new Error(`Missing session(id = ${data.sessionId})`)
        }

        if (data.sessionId && isChannelEvent(data)) {
          debugChannelEvent(data);

          const session = this.sessions.get(data.sessionId)!;
          session.emit(data.method, data);
        } else if (isChannelEvent(data)) {
          debugChannelEvent(data);

          this.emit(data.method, data);
        } else if (isChannelRespnose(data)) {
          debugChannelResponse(data);

          const promiseArgs = this._promiseMap.get(data.id);
          if (promiseArgs) {
            this._promiseMap.delete(data.id);
            promiseArgs.resolve(data);
          }
        }
      });
  
      this._ws.addEventListener('close', () => {
        // if (onClose) {
        //   onClose();
        // }
      });
      // Silently ignore all errors - we don't know what to do with them.
      this._ws.addEventListener('error', () => {});

      this._ws.addEventListener('open', () => {
        return resolve();
      });
      this._ws.addEventListener('error', reject);
    })
  }

  teardown(): void | Promise<void> {
    
  }




  protected _checkSession(sessionId?: string) {
    if (!sessionId || !this.sessions.has(sessionId)) {
      throw `Missing session of channel (id = ${sessionId})`
    }
  }

  onSession<T extends keyof ProtocolMapping.Events>(sessionId: string, eventName: T, listener: (event: ChannelEvent<T>) => void): this {
    this._checkSession(sessionId);
    return this.on(`${eventName}.${sessionId}`, listener);
  }

  // offSession<T extends keyof ProtocolMapping.Events>(sessionId: string, eventName: T, listener: (event: ChannelEvent<T>) => void): this {
  //   this._checkSession(sessionId);
  //   return this.off(`${eventName}.${sessionId}`, listener);
  // }

  on(eventName: string, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  requestSession<T extends keyof ProtocolMapping.Commands>(sessionId: string, method: T, params: ProtocolMapping.Commands[T]['paramsType'][0]): Promise<ChannelResponse<T>> {
    return this._request(method, params, sessionId);
  }


  // on<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (params: ProtocolMapping.Events[T][0]) => void): this {
  //   return this.on(eventName, listener);
  // }

  // addListener<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (params: ProtocolMapping.Events[T][0]) => void): this {
  //   return this.addListener(eventName, listener);
  // }

  request<T extends keyof ProtocolMapping.Commands>(method: T, params: ProtocolMapping.Commands[T]['paramsType'][0], sessionId?: string): Promise<ChannelResponse<T>> {
    return this._request(method, params, sessionId);
  }

  createSession({ sessionId, targetType }: { sessionId: string; targetType: string }): SessionInterface {
    const session = this._deps.SessionFactory.create({
      targetType,
      sessionId,
      channel: this,
    });
    this.sessions.set(sessionId, session);
    return session;
  }


  protected _request<T extends keyof ProtocolMapping.Commands>(
    method: T,
    params: ProtocolMapping.Commands[T]['paramsType'][0],
    sessionId?: string,
  ): Promise<ChannelResponse<T>> {
    return new Promise((resolve, reject) => {
      const id = this._genUid();
      const stringifiedMessage = JSON.stringify({ method, params, id, sessionId });
      debugChannelRequest(stringifiedMessage);

      this._ws.send(stringifiedMessage);

      this._promiseMap.set(id, {
        resolve,
        reject,
        error: new Error(),
        method,
      })
    });
  }

  close(): void {
    this._ws.close();
  }

  protected _genUid = (() => {
    let uid = 1;
    return () => uid++;
  })()
}

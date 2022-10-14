import { EventEmitter } from 'node:events';
import type {
  Session as SessionInterface,
  ChannelResponse,
  ChannelDependencies,
  SessionDependencies,
  SessionFactory as SessionFactoryInterface
} from './types';
import type { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';

export const SessionFactory = <SessionFactoryInterface>class Session extends EventEmitter implements SessionInterface {
  static create(deps: SessionDependencies) {
    return new Session(deps);
  }

  sessionId: string;

  constructor(protected _deps: SessionDependencies) {
    super();
    this.sessionId = _deps.sessionId;
  }

  request<T extends keyof ProtocolMapping.Commands>(method: T, params: ProtocolMapping.Commands[T]['paramsType'][0]): Promise<ChannelResponse<T>> {
    return this._deps.channel.request(method, params, this.sessionId);
  }
}

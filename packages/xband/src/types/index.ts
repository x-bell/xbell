import type { EventEmitter } from 'node:events';
import type { ChildProcess } from 'node:child_process';
import type { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';
import type { Protocol } from 'devtools-protocol';
import type WebSocket from 'ws';

export interface BrowserDependencies {
  process: ChildProcess;
  ChannelFactory: ChannelFactory;
  // BrowserContextFactory: BrowserContextFactory;
  TargetManagerFactory: TargetManagerFactory;
  TargetFactory: TargetFactory;
  SessionFactory: SessionFactory;
  PageFactory: PageFactory;
  FrameFactory: FrameFactory;
  FrameManagerFactory: FrameManagerFactory;
}
export interface Browser extends EventEmitter, UnifyLifecycle {
  // targets(): Target[];
  // pages(): Promise<Page[]>;
  newPage(): Promise<Page>;
}

export interface BrowserFactory {
  create(deps: BrowserDependencies): Promise<Browser>;
}

export interface BrowserContextDependencies {
  channel: Channel;
  browser: Browser;
  targetManager: TargetManager;
}

export interface BrowserContext {
  pages(): Promise<Page[]>;
  targets(): Target[];
  newPage(): Promise<Page>;
  browser(): Promise<Browser>;
}

// class Imp implements BrowserContext {
//   constructor(deps: number) {
//   }

//   pages(): Promise<Page[]> {
    
//   }

//   targets(): Promise<Target[]> {
    
//   }

//   browser(): Promise<Browser> {
    
//   }
//   newPage(): Promise<Page> {
    
//   }
// }

export interface BrowserContextFactory {
  create(deps: {
    browser: Browser;
    channel: Channel;
  }): BrowserContext;
}

export interface ChannelEvent<T extends keyof ProtocolMapping.Events> {
  params: ProtocolMapping.Events[T][0];
  method: T;
  sessionId?: string;
}

export interface ChannelResponse<T extends keyof ProtocolMapping.Commands> {
  id: number;
  result: ProtocolMapping.Commands[T]['returnType'];
  sessionId?: string;
}

export interface ChannelEventEmitter extends EventEmitter {
  emit<T extends keyof ProtocolMapping.Events>(eventName: T, event: ChannelEvent<T>): boolean;

  on<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (event: ChannelEvent<T>) => void): this;
  off<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (event: ChannelEvent<T>) => void): this;

  addListener<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (event: ChannelEvent<T>) => void): this;
  removeListener<T extends keyof ProtocolMapping.Events>(eventName: T, listener: (event: ChannelEvent<T>) => void): this;
}

export interface Channel extends ChannelEventEmitter, UnifyLifecycle {
  sessions: Map<string, Session>;

  request<T extends keyof ProtocolMapping.Commands>(
    method: T,
    params: ProtocolMapping.Commands[T]['paramsType'][0],
    sessionId?: string,
  ): Promise<ChannelResponse<T>>;
  createSession(options: {
    sessionId: string
    targetType: string;
  }): Session;
}

export interface ChannelDependencies {
  url: string;
  SessionFactory: SessionFactory;
}

export interface ChannelFactory {
  create(deps: ChannelDependencies): Promise<Channel>;
}

export interface Page extends UnifyLifecycle {
  goto(url: string): Promise<void>;
}

export interface PageDependencies {
  session: Session;
  FrameManagerFactory: FrameManagerFactory;
  FrameFactory: FrameFactory;
}

export interface PageFactory {
  create(deps: PageDependencies): Promise<Page>;
}

export interface Target extends UnifyLifecycle {
  targetId: string;
  targetInfo: Protocol.Target.TargetInfo;
  setTargetInfo(targetInfo: Protocol.Target.TargetInfo): void;
  page() : Promise<Page | null>;
  // browserContext: BrowserContext;
}

// export interface BrowserTarget extends Target {

// }

// export interface PageTarget extends Target {

// }

export interface TargetDependencies {
  targetInfo: Protocol.Target.TargetInfo;
  session: Session;
  PageFactory: PageFactory;
  FrameFactory: FrameFactory;
  FrameManagerFactory: FrameManagerFactory;
}

export interface TargetFactory {
  create(deps: TargetDependencies): Target;
}

export interface UnifyLifecycle {
  setup(): Promise<void> | void;
  teardown(): Promise<void> | void;
}

export interface TargetManager extends EventEmitter, UnifyLifecycle {
  createTarget(options: {
    url: string;
    browserContextId?: string;
  }): Promise<Target>;
}

export interface TargetManagerDependencies {
  channel: Channel;
  TargetFactory: TargetFactory;
  PageFactory: PageFactory;
  FrameFactory: FrameFactory;
  FrameManagerFactory: FrameManagerFactory;
}

export interface TargetManagerFactory {
  create(desp: TargetManagerDependencies): Promise<TargetManager>;
}

// Each target requires one session
export interface Session extends ChannelEventEmitter {
  sessionId: string;
  request<T extends keyof ProtocolMapping.Commands>(
    method: T,
    params: ProtocolMapping.Commands[T]['paramsType'][0],
  ): Promise<ChannelResponse<T>>;
}

export interface SessionDependencies {
  channel: Channel;
  sessionId: string;
  targetType: string;
}

export interface SessionFactory {
  create(deps: SessionDependencies): Session;
}

export interface SessionManager extends UnifyLifecycle {
  // sessions: Map<string, Session>;
}

export interface SessionManagerDependencies {
  channel: Channel;
  SessionFactory: SessionFactory;
}

export interface SessionManagerFactory {
  create(desp: SessionManagerDependencies): SessionManager;
}

export interface FrameManager extends UnifyLifecycle {
  mainFrame(): Frame;
}

export interface FrameManagerDependencies {
  session: Session;
  FrameFactory: FrameFactory;
}

export interface FrameManagerFactory {
  create(desp: FrameManagerDependencies): Promise<FrameManager>;
}

export interface NetworkManager extends UnifyLifecycle {

}

export interface NetworkManagerDependencies {

}

export interface NetworkManagerFactory {
  create(_deps: NetworkManagerFactory): NetworkManager
}

export interface XBand {
  launch(): Promise<Browser>;
}

export type BrowserName =
  | 'chrome';

export interface XBandDependencies {
  BrowserFactory: BrowserFactory;
  SessionFactory: SessionFactory;
  // BrowserContextFactory: BrowserContextFactory;
  ChannelFactory: ChannelFactory;
  TargetFactory: TargetFactory;
  TargetManagerFactory: TargetManagerFactory;
  LauncherFactories: Record<BrowserName, BrowserLauncherFactory>;
  FrameManagerFactory: FrameManagerFactory;
  FrameFactory: FrameFactory;
  PageFactory: PageFactory;
}

export interface XBandFactory {
  create(deps: XBandDependencies): XBand;
}


export interface BrowserLauncher {
  launch(): Promise<Browser>;
}

export interface BrowserLauncherDependencies {
  BrowserFactory: BrowserFactory;
  // BrowserContextFactory: BrowserContextFactory;
  ChannelFactory: ChannelFactory;
  TargetFactory: TargetFactory;
  TargetManagerFactory: TargetManagerFactory;
  SessionFactory: SessionFactory;
  PageFactory: PageFactory;
  FrameFactory: FrameFactory;
  FrameManagerFactory: FrameManagerFactory;
}

export interface BrowserLauncherFactory {
  create(deps: BrowserLauncherDependencies): BrowserLauncher;
}


export interface Frame {
  childFrames: Set<Frame>
  goto(url: string): Promise<void>;
  frameId: string;
}

export interface FrameFactory {
  create(deps: FrameDependencies): Frame;
}

export interface FrameDependencies {
  frameId: string;  
  session: Session;
}

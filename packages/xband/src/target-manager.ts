import type Protocol from 'devtools-protocol';
import type { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';
// import type { Channel } from './channel';
import { debugError } from './utils/error';
import type {
  ChannelEvent,
  TargetManager as TargetManagerInterface,
  TargetManagerDependencies,
  TargetManagerFactory as TargetManagerFactoryInterface,
} from './types';
import { EventEmitter } from 'node:events';
import type { Target, Session, Channel } from './types';
import { genSetupPromise } from './utils/promise';

export const TargetManagerFactory = <TargetManagerFactoryInterface>class TargetManger extends EventEmitter implements TargetManagerInterface {
  static async create(deps: TargetManagerDependencies) {
    const targetManager = new TargetManger(deps);
    await targetManager.setup()
    return targetManager;
  }

  protected _discoverTargets = new Map<string, Protocol.Target.TargetInfo>();
  protected _attachedTargets = new Map<string, Target>();
  protected _attachedTargetsBySessionId = new Map<string, Target>();
  protected _targetsIdsForInit = new Set<string>();
  // TODO:
  protected _ignoredTargets = new Set<string>();
  protected _setupPromise = genSetupPromise()

  constructor(protected _deps: TargetManagerDependencies) {
    super();
    const { channel } = this._deps;
    channel.on('Target.targetCreated', this._handleTargetCreated);
    channel.on('Target.targetDestroyed', this._handleTargetDestroyed);
    channel.on('Target.targetInfoChanged', this._handleTargetInfoChanged);

    this._deps.channel
      .request('Target.setDiscoverTargets', {
        discover: true,
        filter: [{type: 'tab', exclude: true}, {}],
      } as any)
      .then(() => {
        for (const [
          targetId,
          targetInfo,
        ] of this._discoverTargets.entries()) {
          // (!this.#targetFilterCallback ||
          //   this.#targetFilterCallback(targetInfo)) &&
          if (targetInfo.type !== 'browser') {
            this._targetsIdsForInit.add(targetId);
          }
        }
      })
      .catch(debugError);

    this._setupAttachmentListeners(this._deps.channel);
    // TODO:
    // channel.on('Target.attachedToTarget', this._handleAttachedToTarget);
    // channel.on('Target.detachedFromTarget', this._handleDetachedFromTarget);

    // this._deps.channel.request('Page.navigate', {
    //   url: 'https://www.baidu.com',
    // });
  }

  async setup(): Promise<void> {
    await this._deps.channel.request('Target.setAutoAttach', {
      waitForDebuggerOnStart: true,
      flatten: true,
      autoAttach: true,
    });
    await this._setupPromise.promise;
    
  }

  teardown(): void | Promise<void> {
    const { channel } = this._deps;
    channel.off('Target.targetCreated', this._handleTargetCreated);
    channel.off('Target.targetDestroyed', this._handleTargetDestroyed);
    channel.off('Target.targetInfoChanged', this._handleTargetInfoChanged);
    // TODO:
    // channel.off('Target.attachedToTarget', this._handleAttachedToTarget);
    // channel.off('Target.detachedFromTarget', this._handleDetachedFromTarget);
  }


  // created
  protected _handleTargetCreated = async (event: ChannelEvent<'Target.targetCreated'>) => {
    const { targetInfo } = event.params;
    this._discoverTargets.set(
      targetInfo.targetId,
      targetInfo
    );

    // TODO:
    // this.emit(TargetManagerEmittedEvents.TargetDiscovered, targetInfo);

    // The connection is already attached to the browser target implicitly,
    // therefore, no new Session is created and we have special handling
    // here.
    // 浏览器已经隐式附加上去了，所以没有 attachedToTarget 方法，直接在这解决
    if (targetInfo.type === 'browser' && targetInfo.attached) {
      if (this._attachedTargets.has(targetInfo.targetId)) {
        return;
      }
      const session: any = {};
      const { PageFactory, FrameFactory, FrameManagerFactory } = this._deps;
      const target = this._deps.TargetFactory.create({
        targetInfo,
        session,
        PageFactory,
        FrameFactory,
        FrameManagerFactory,
      });
      this._attachedTargets.set(targetInfo.targetId, target);
    }

    // TODO:
    // if (event.targetInfo.type === 'shared_worker') {
    //   // Special case (https://crbug.com/1338156): currently, shared_workers
    //   // don't get auto-attached. This should be removed once the auto-attach
    //   // works.
    //   await this._deps.channel._createSession(event.targetInfo, true);
    // }
  }

  protected _handleTargetInfoChanged = (event: ChannelEvent<'Target.targetInfoChanged'>) => {
    const { targetInfo } = event.params;
    this._discoverTargets.set(
      targetInfo.targetId,
      targetInfo
    );


    if (
      this._ignoredTargets.has(targetInfo.targetId) ||
      !this._attachedTargets.has(targetInfo.targetId) ||
      !targetInfo.attached
    ) {
      return;
    }


    const target = this._attachedTargets.get(
      targetInfo.targetId
    );

    // TODO: browser 通过判断 prevUrl 去判断事情
    // this.emit(TargetManagerEmittedEvents.TargetChanged, {
    //   target: target!,
    //   targetInfo: targetInfo,
    // });

    if (!target)
      throw new Error(`Missing target(id = ${targetInfo.targetId})`)

    target.setTargetInfo(targetInfo);
  }

  protected _handleTargetDestroyed = (event: ChannelEvent<'Target.targetDestroyed'>) => {
    const targetInfo = this._discoverTargets.get(event.params.targetId);
    this._discoverTargets.delete(event.params.targetId);
    // TODO:
    // this.#finishInitializationIfReady(event.params.targetId);
    if (
      targetInfo?.type === 'service_worker' &&
      this._attachedTargets.has(targetInfo.targetId)
    ) {
      // Special case for service workers: report TargetGone event when
      // the worker is destroyed.
      const target = this._attachedTargets.get(targetInfo.targetId);
      // TODO:
      // this.emit(TargetManagerEmittedEvents.TargetGone, target);
      this._attachedTargets.delete(targetInfo.targetId);
    }
  }

  protected _handleDetachedFromTarget = (event: ChannelEvent<'Target.detachedFromTarget'>) => {

  }

  protected _handleAttachedToTarget = async (
    e: ChannelEvent<'Target.attachedToTarget'>,
    parentSession: Channel | Session,
  ) => {
    const { channel, PageFactory, FrameFactory, FrameManagerFactory } = this._deps;
    const event = e.params;
    const targetInfo = event.targetInfo;
    const session = channel.createSession({
      sessionId: event.sessionId,
      targetType: event.targetInfo.type,
    });

    // const silentDetach = async () => {
    //   await session.request('Runtime.runIfWaitingForDebugger', undefined).catch(debugError);
    //   // TODO:
    //   // We don't use `session.detach()` because that dispatches all commands on
    //   // the connection instead of the parent session.
    //   await session.request('Target.detachFromTarget', {
    //     sessionId: event.sessionId,
    //   })
    //     .catch(debugError);
    // };

    // if (!this.#connection.isAutoAttached(targetInfo.targetId)) {
    //   return;
    // }

    // Special case for service workers: being attached to service workers will
    // prevent them from ever being destroyed. Therefore, we silently detach
    // from service workers unless the connection was manually created via
    // `page.worker()`. To determine this, we use
    // `this.#connection.isAutoAttached(targetInfo.targetId)`. In the future, we
    // should determine if a target is auto-attached or not with the help of
    // CDP.
    // TODO:
    // if (
    //   targetInfo.type === 'service_worker' &&
    //   this.#connection.isAutoAttached(targetInfo.targetId)
    // ) {
    //   this.#finishInitializationIfReady(targetInfo.targetId);
    //   await silentDetach();
    //   if (this.#attachedTargetsByTargetId.has(targetInfo.targetId)) {
    //     return;
    //   }
    //   const target = this.#targetFactory(targetInfo);
    //   this.#attachedTargetsByTargetId.set(targetInfo.targetId, target);
    //   this.emit(TargetManagerEmittedEvents.TargetAvailable, target);
    //   return;
    // }

    // if (this.#targetFilterCallback && !this.#targetFilterCallback(targetInfo)) {
    //   this.#ignoredTargets.add(targetInfo.targetId);
    //   this.#finishInitializationIfReady(targetInfo.targetId);
    //   await silentDetach();
    //   return;
    // }

    const existingTarget = this._attachedTargets.has(
      targetInfo.targetId
    );

    if (!existingTarget) {
      const newTarget = this._deps.TargetFactory.create({
        targetInfo,
        session,
        FrameFactory,
        PageFactory,
        FrameManagerFactory
      });
      this._attachedTargets.set(targetInfo.targetId, newTarget);
    }

    const target = this._attachedTargets.get(targetInfo.targetId)!

    this._setupAttachmentListeners(session);

    this._attachedTargetsBySessionId.set(
      session.sessionId,
      target
    );

    // for (const interceptor of this.#targetInterceptors.get(parentSession) ||
    //   []) {
    //   if (!(parentSession instanceof Connection)) {
    //     // Sanity check: if parent session is not a connection, it should be
    //     // present in #attachedTargetsBySessionId.
    //     assert(this.#attachedTargetsBySessionId.has(parentSession.id()));
    //   }
    //   await interceptor(
    //     target,
    //     parentSession instanceof Connection
    //       ? null
    //       : this.#attachedTargetsBySessionId.get(parentSession.id())!
    //   );
    // }

    // TODO:
    // if (!existingTarget) {
    //   this.emit(TargetManagerEmittedEvents.TargetAvailable, target);
    // }
    this._finishedTargetAndCheckSetup(target.targetId);

    // TODO: the browser might be shutting down here. What do we do with the
    // error?
    await Promise.all([
      session.request('Target.setAutoAttach', {
        waitForDebuggerOnStart: true,
        flatten: true,
        autoAttach: true,
      }),
      session.request('Runtime.runIfWaitingForDebugger', undefined),
    ]).catch(debugError);
  };

  async createTarget(options: { url: string; browserContextId?: string | undefined; }): Promise<Target> {
    const { result } = await this._deps.channel.request('Target.createTarget', options);
    // create by events
    const target = this._attachedTargets.get(result.targetId);
    if (!target) {
      throw new Error(`Missing target for page (id = ${result.targetId})`);
    }

    await target.setup;

    return target;
  }

  protected _finishedTargetAndCheckSetup(targetId: string) {
    this._targetsIdsForInit.delete(targetId);
    if (!this._targetsIdsForInit.size) {
      this._setupPromise.resolve();
    }
  }

  protected _setupAttachmentListeners(session: Channel | Session): void {
    const listener = (event: ChannelEvent<'Target.attachedToTarget'>) => {
      return this._handleAttachedToTarget(event, session);
    };
    // if (this.)
    // TODO:
    // assert(!this.#attachedToTargetListenersBySession.has(session));
    // this.#attachedToTargetListenersBySession.set(session, listener);
    session.on('Target.attachedToTarget', listener);

    // TODO:
    // const detachedListener = (
    //   event: Protocol.Target.DetachedFromTargetEvent
    // ) => {
    //   return this.#onDetachedFromTarget(session, event);
    // };
    // assert(!this.#detachedFromTargetListenersBySession.has(session));
    // this.#detachedFromTargetListenersBySession.set(session, detachedListener);
    // session.on('Target.detachedFromTarget', detachedListener);
  }
}

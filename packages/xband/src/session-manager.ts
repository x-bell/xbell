// import type {
//   Session, SessionManager as SessionManagerInterface,
//   SessionManagerFactory as SessionManagerFactoryInterface,
//   SessionManagerDependencies,
//   ChannelEvent
// } from './types';

// // TODO: 维护了 sessions
// export const SessionManagerFactory = <SessionManagerFactoryInterface>class SessionManager implements SessionManagerInterface {
//   static create(deps: SessionManagerDependencies) {
//     return new SessionManager(deps);
//   }

//   protected _sessionMap: Map<string, Session> = new Map();

//   constructor(protected _deps: SessionManagerDependencies) {}

//   setup(): void | Promise<void> {
//     this._deps.channel.on('Target.attachedToTarget', this._handleAttachedToTarget);
//     this._deps.channel.on('Target.detachedFromTarget', this._handleDetachedFromTarget);
//   }

//   teardown(): void | Promise<void> {
//     this._deps.channel.off('Target.attachedToTarget', this._handleAttachedToTarget);
//     this._deps.channel.off('Target.detachedFromTarget', this._handleDetachedFromTarget);
//   }

//   protected _handleAttachedToTarget(event: ChannelEvent<'Target.attachedToTarget'>) {
//     const { sessionId, targetInfo } = event.params;
//     const { type: targetType } = targetInfo;
//     const { SessionFactory, channel } = this._deps;
//     const cdpSession = SessionFactory.create({
//       channel,
//       sessionId,
//       targetType,
//     });
//     this.sessions.set(sessionId, cdpSession);
//   }

//   protected _handleDetachedFromTarget(event: ChannelEvent<'Target.detachedFromTarget'>) {
//     const { sessionId } = event.params;
//     this._sessionMap.delete(sessionId);
//   }
// }

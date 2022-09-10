import {
  FrameManager as FrameManagerInterface,
  Frame,
  FrameManagerDependencies,
  FrameManagerFactory as FrameManagerFactoryInterface,
  Session,
} from './types';
import type { Protocol } from 'devtools-protocol';
import { debug } from './utils/debug';

const debugFrameManager = debug('FrameManager');

export const FrameManagerFactory = <FrameManagerFactoryInterface>class FrameManager implements FrameManagerInterface {
  static async create(deps: FrameManagerDependencies) {
    const frameManager =  new FrameManager(deps)
    await frameManager.setup();
    return frameManager;
  }

  _mainFrame?: Frame;

  constructor (protected _deps: FrameManagerDependencies) {
    const session = this._deps.session;
    session.on('Page.frameNavigated', ({ params }) => {
      this._handleFrameNavigated(params.frame);
    });
  }

  protected _frames = new Map<string, Frame>();

  async setup(): Promise<void> {
    debugFrameManager('setup start...');

    const { session } = this._deps;
    const [, { result }] = await Promise.all([
      session.request('Page.enable', undefined),
      session.request('Page.getFrameTree', undefined),
      session.request('Performance.enable', undefined),
      session.request('Log.enable', undefined),
    ]);
    debugFrameManager('getFrameTree done!');

    await Promise.all([
      session.request('Page.setLifecycleEventsEnabled', {enabled: true}),
      session.request('Runtime.enable', undefined).then(() => {
        // TODO:
        // return this.#createIsolatedWorld(client, UTILITY_WORLD_NAME);
      }),
      // TODO: Network manager is not aware of OOP iframes yet.
      // client === this.#client
      //   ? this.#networkManager.initialize()
      //   : Promise.resolve(),
    ]);

    debugFrameManager('Page.setLifecycleEventsEnabled Runtime.enable');


    this._handleFrameTree(session, result.frameTree)
    debugFrameManager('setup done!');

    // const {frameTree} = result[1];
    // this.#handleFrameTree(client, frameTree);
    // session.on('Page.frameAttached', ({ params }) => {
    //   this._handleFrameAttached(session, params.frameId, params.parentFrameId);
    // });
    // session.on('Page.navigatedWithinDocument', ({ params }) => {
    //   this.#onFrameNavigatedWithinDocument(params.frameId, params.url);
    // });
    // session.on(
    //   'Page.frameDetached',
    //   (event: Protocol.Page.FrameDetachedEvent) => {
    //     this.#onFrameDetached(
    //       event.frameId,
    //       event.reason as Protocol.Page.FrameDetachedEventReason
    //     );
    //   }
    // );
    // session.on('Page.frameStartedLoading', event => {
    //   this.#onFrameStartedLoading(event.frameId);
    // });
    // session.on('Page.frameStoppedLoading', event => {
    //   this.#onFrameStoppedLoading(event.frameId);
    // });
    // session.on('Runtime.executionContextCreated', event => {
    //   this.#onExecutionContextCreated(event.context, session);
    // });
    // session.on('Runtime.executionContextDestroyed', event => {
    //   this.#onExecutionContextDestroyed(event.executionContextId, session);
    // });
    // session.on('Runtime.executionContextsCleared', () => {
    //   this.#onExecutionContextsCleared(session);
    // });
    // session.on('Page.lifecycleEvent', this._handleLifecycleEvent);
  }

  teardown(): void | Promise<void> {

  }

  // protected _handleFrameAttached(
  //   session: Session,
  //   frameId: string,
  //   parentFrameId: string
  // ): void {
  //   if (this._frames.has(frameId)) {
  //     // TODO:
  //     // const frame = this._frames.get(frameId)!;
  //     // if (session && frame.isOOPFrame()) {
  //     //   // If an OOP iframes becomes a normal iframe again
  //     //   // it is first attached to the parent page before
  //     //   // the target is removed.
  //     //   frame.updateClient(session);
  //     // }
  //     return;
  //   }
  //   const parentFrame = this._frames.get(parentFrameId);

  //   const complete = (parentFrame: Frame) => {
  //     if (!parentFrame) {
  //       throw new Error(`Parent frame ${parentFrameId} not found`);
  //     }

  //     const frame = new Frame(this, parentFrame, frameId, session);
  //     this._frames.set(frame._id, frame);
  //     this.emit(FrameManagerEmittedEvents.FrameAttached, frame);
  //   };

  //   if (parentFrame) {
  //     return complete(parentFrame);
  //   }

  //   const frame = this._framesPendingTargetInit.get(parentFrameId);
  //   if (frame) {
  //     if (!this._framesPendingAttachment.has(frameId)) {
  //       this._framesPendingAttachment.set(
  //         frameId,
  //         createDeferredPromise({
  //           message: `Waiting for frame ${frameId} to attach failed`,
  //         })
  //       );
  //     }
  //     frame.then(() => {
  //       complete(this._frames.get(parentFrameId)!);
  //       this._framesPendingAttachment.get(frameId)?.resolve();
  //       this._framesPendingAttachment.delete(frameId);
  //     });
  //     return;
  //   }

  //   throw new Error(`Parent frame ${parentFrameId} not found`);
  // }

  protected _handleFrameNavigated(framePayload: Protocol.Page.Frame): void {
    const { FrameFactory } = this._deps;
    const frameId = framePayload.id;
    const isMainFrame = !framePayload.parentId;
    const frame = isMainFrame ? this._mainFrame : this._frames.get(frameId);

    const complete = (frame?: Frame) => {
      if (!isMainFrame && !frame) {
        throw new Error(`Missing frame isMainFrame=${isMainFrame}, frameId=${frameId}`)
      }

      // Detach all child frames first.
      if (frame) {
        for (const child of frame.childFrames) {
          this._removeFramesRecursively(child);
        }
      }

      // Update or create main frame.
      if (isMainFrame) {
        if (frame) {
          // Update frame id to retain frame identity on cross-process navigation.
          this._frames.delete(frame.frameId);
          frame.frameId = frameId;
        } else {
          // Initial main frame navigation.
          frame = FrameFactory.create({
            frameId,
            session: this._deps.session,
            // session
          });
        }
        this._frames.set(frameId, frame);
        debugFrameManager('setMainFrame');
        this._mainFrame = frame;
      }

      // Update frame payload.
      // assert(frame);
      if (!frame) {
        throw new Error('Missing frame')
      }
      // frame._navigated(framePayload);

      // this.emit(FrameManagerEmittedEvents.FrameNavigated, frame);
    };
    // TODO:
    // const pendingFrame = this._framesPendingAttachment.get(frameId);
    // if (pendingFrame) {
    //   pendingFrame.then(() => {
    //     complete(isMainFrame ? this._mainFrame : this._frames.get(frameId));
    //   });
    // } else {
      complete(frame);
    // }
  }

  mainFrame(): Frame {
    if (!this._mainFrame) {
      throw new Error('Missing mainFrame');
    }
    return this._mainFrame!;
  }

  protected _handleLifecycleEvent() {

  }

  protected _removeFramesRecursively(frame: Frame): void {
    for (const child of frame.childFrames) {
      this._removeFramesRecursively(child);
    }
    // frame._detach();
    this._frames.delete(frame.frameId);
    // this.emit(FrameManagerEmittedEvents.FrameDetached, frame);
  }

  protected _handleFrameTree(
    session: Session,
    frameTree: Protocol.Page.FrameTree
  ): void {
    // TODO:
    // if (frameTree.frame.parentId) {
    //   this.#onFrameAttached(
    //     session,
    //     frameTree.frame.id,
    //     frameTree.frame.parentId
    //   );
    // }
    this._handleFrameNavigated(frameTree.frame);
    if (!frameTree.childFrames) {
      return;
    }

    for (const child of frameTree.childFrames) {
      this._handleFrameTree(session, child);
    }
  }
}

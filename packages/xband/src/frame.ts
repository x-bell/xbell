import { isErrorLike } from './utils/error';
import type { Frame as FrameInterface, FrameFactory as FrameFactoryInterface, FrameDependencies } from './types';



export const FrameFactory = <FrameFactoryInterface>class Frame implements FrameInterface {
  static create(deps: FrameDependencies) {
    return new Frame(deps);
  }
  
  constructor(protected _deps: FrameDependencies) {
    this.frameId = _deps.frameId;
  }

  frameId: string;
  public childFrames = new Set<FrameInterface>;

  async goto(url: string): Promise<void> {
    await this._navigate({ url });
    // const {
    //   referer = this._frameManager.networkManager.extraHTTPHeaders()['referer'],
    //   waitUntil = ['load'],
    //   timeout = this._frameManager.timeoutSettings.navigationTimeout(),
    // } = options;

    // let ensureNewDocumentNavigation = false;
    // TODO:
    // const watcher = new LifecycleWatcher(
    //   this._frameManager,
    //   this,
    //   waitUntil,
    //   timeout
    // );
    // let error = await Promise.race([
    //   navigate(this.#client, url, referer, this._id),
    //   watcher.timeoutOrTerminationPromise(),
    // ]);
    // if (!error) {
    //   error = await Promise.race([
    //     watcher.timeoutOrTerminationPromise(),
    //     ensureNewDocumentNavigation
    //       ? watcher.newDocumentNavigationPromise()
    //       : watcher.sameDocumentNavigationPromise(),
    //   ]);
    // }

    // try {
    //   if (error) {
    //     throw error;
    //   }
    //   return await watcher.navigationResponse();
    // } finally {
    //   watcher.dispose();
    // }
  }

  async _navigate({
    url
  }: {
    url: string
  }) {
    try {
      const { result } = await this._deps.session.request('Page.navigate', {
        url,
        frameId: this.frameId,
        // referrer,
        // frameId,
      });
      // ensureNewDocumentNavigation = !!result.loaderId;
      return result.errorText
        ? new Error(`${result.errorText} at ${url}`)
        : null;
    } catch (error) {
      if (isErrorLike(error)) {
        return error;
      }
      throw error;
    }
  }

}

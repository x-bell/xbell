import type { Protocol } from 'devtools-protocol';
import type {
  Page,
  Target as TargetInterface,
  TargetFactory as TargetFactoryInterface,
  TargetDependencies
} from './types';
import { genSetupPromise } from './utils/promise';

function isPageTarget(targetInfo: Protocol.Target.TargetInfo) {
  return targetInfo.type === 'page' ||
    targetInfo.type === 'background_page' ||
    targetInfo.type === 'webview'
}

export const TargetFactory = <TargetFactoryInterface>class Target implements TargetInterface {
  static create(_deps: TargetDependencies) {
    return new Target(_deps)
  }

  protected _setupPromise = genSetupPromise();

  targetId: string;

  targetInfo: Protocol.Target.TargetInfo;

  protected _pagePromise?: Promise<Page>;

  constructor(protected _deps: TargetDependencies) {
    this.targetId = _deps.targetInfo.targetId;
    this.targetInfo = _deps.targetInfo;
    if (!isPageTarget(_deps.targetInfo) || _deps.targetInfo.url !== '') {
      this._setupPromise.resolve()
    }
  }

  async page(): Promise<Page | null> {
    if (isPageTarget(this.targetInfo) && !this._pagePromise) {
      const { session, FrameFactory, FrameManagerFactory } = this._deps;
      this._pagePromise = Promise.resolve(this._deps.PageFactory.create({
        session,
        FrameFactory,
        FrameManagerFactory
      }));
    }
    return (await this._pagePromise) ?? null;
  }

  setTargetInfo(targetInfo: Protocol.Target.TargetInfo) {
    this.targetInfo = targetInfo;
    if (this._setupPromise.stateRef.value === 'pending' && (!isPageTarget(targetInfo) || targetInfo.url !== '')) {
      this._setupPromise.resolve();
    }
  }


  async setup(): Promise<void> {
    await this._setupPromise.promise;
  }

  teardown(): void | Promise<void> {

  }

}
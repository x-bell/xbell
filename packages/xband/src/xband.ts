import type {
  XBandDependencies,
  Browser,
  XBand as XBandInterface,
  XBandFactory as XBandFactoryInterface
} from './types';

export const XBandFactory: XBandFactoryInterface = class XBand implements XBandInterface {
  static create(deps: XBandDependencies) {
    return new XBand(deps);
  }

  constructor (protected _deps: XBandDependencies) {
    // const { ChannelFactory, TargetManagerFactory } = _deps;
    // const channel = ChannelFactory.create();
  }

  launch(): Promise<Browser> {
    const {
      LauncherFactories,
      BrowserFactory,
      ChannelFactory,
      TargetManagerFactory,
      TargetFactory,
      SessionFactory,
      PageFactory,
      FrameFactory,
      FrameManagerFactory
    } = this._deps;
    const ChromeLaunchFactory = LauncherFactories.chrome
    return ChromeLaunchFactory.create({
      BrowserFactory,
      ChannelFactory,
      TargetFactory,
      TargetManagerFactory,
      SessionFactory,
      PageFactory,
      FrameFactory,
      FrameManagerFactory
    }).launch();
  }
}

import { XBandFactory } from './xband';
import { ChromeLauncherFactory } from './launchers/chrome';
import { ChannelFactory } from './channel';
import { BrowserFactory } from './browser';
import { TargetManagerFactory } from './target-manager';
import { FrameManagerFactory } from './frame-manager';
import { FrameFactory } from './frame';
import { TargetFactory } from './target';
import { PageFactory } from './page';
import { SessionFactory } from './session';
// import { BrowserContext } from './browser-context';

const xband = XBandFactory.create({
  LauncherFactories: {
    chrome: ChromeLauncherFactory,
  },
  ChannelFactory,
  BrowserFactory,
  TargetManagerFactory,
  FrameManagerFactory,
  FrameFactory,
  TargetFactory,
  PageFactory,
  SessionFactory
  // BrowserContextFactory,
});

const browser = await xband.launch();
console.log('launch');

const page = await browser.newPage()
console.log('newPage');

await page.goto('https://www.baidu.com');
console.log('goto');

console.log('page', page);

export default xband;

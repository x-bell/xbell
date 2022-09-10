import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import type { Browser, BrowserLauncher, BrowserLauncherDependencies, BrowserLauncherFactory } from '../types';
import { PageFactory } from '../page';

export const args = [
  '--allow-pre-commit-input',
  '--disable-background-networking',
  '--enable-features=NetworkServiceInProcess2',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-features=Translate,BackForwardCache,AcceptCHFrame,AvoidUnnecessaryBeforeUnloadCheckSync',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-popup-blocking',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-sync',
  '--force-color-profile=srgb',
  '--metrics-recording-only',
  '--no-first-run',
  '--enable-automation',
  '--password-store=basic',
  '--use-mock-keychain',
  '--enable-blink-features=IdleDetection',
  '--export-tagged-pdf',
  '--headless',
  '--hide-scrollbars',
  '--mute-audio',
  'about:blank',
  '--remote-debugging-port=0',
  // '--user-data-dir=/var/folders/gk/b4ww9cbd6bq22smsm…33fc0000gn/T/puppeteer_dev_chrome_profile-WF4nz5'
  '--user-data-dir=' + await mkdtemp(
    join(tmpdir(), 'xpeer_dev_chrome_profile-')
  )
]
.filter(item => item !== '--headless');

export const executePath = '/Users/lianghang/Desktop/demos/npm_demo/node_modules/puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium';


// gen process
export const ChromeLauncherFactory = <BrowserLauncherFactory>class ChromeLauncher implements BrowserLauncher {
  static create(deps: BrowserLauncherDependencies) {
    return new ChromeLauncher(deps);
  }

  constructor(protected _deps: BrowserLauncherDependencies) {
    
  }

  launch(): Promise<Browser> {
    const { BrowserFactory, ChannelFactory, TargetFactory, TargetManagerFactory, SessionFactory, PageFactory, FrameFactory, FrameManagerFactory } = this._deps;
    const stdio: Array<'pipe' | 'ignore'> = ['pipe', 'ignore', 'pipe'];
    const browserProcess = spawn(executePath, args, {
      detached: process.platform !== 'win32',
      stdio,
      env: process.env,
    });

    return BrowserFactory.create({
      process: browserProcess,
      ChannelFactory,
      TargetFactory,
      TargetManagerFactory,
      SessionFactory,
      PageFactory,
      FrameFactory,
      FrameManagerFactory
    })
  }
}

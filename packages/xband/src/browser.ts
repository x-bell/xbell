import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { createInterface } from 'node:readline';
import { EventEmitter } from 'node:events';
import { path, args } from './Chrome';
import { TimeoutError } from './utils/error';
import { defaultTimeout } from './constants';
import type { Browser as BrowserInterface, BrowserDependencies, BrowserContext, Page, Target, BrowserFactory as BrowserFactoryInterface, Channel, TargetManager } from './types';
import { TargetManagerFactory } from './target-manager';
import { debug } from './utils/debug';

const debugBrowser = debug('Browser');

function waitForWSEndpoint({
  timeout,
  version,
  browserProcess
}: {
  timeout: number;
  version: string;
  browserProcess: ChildProcess;
}): Promise<string> {
  // assert(this.process.stderr, '`browserProcess` does not have stderr.');
  if (!browserProcess.stderr)
    throw new Error('Browser progress does not have stderr.')

  const rl = createInterface(browserProcess.stderr);
  let stderr = '';

  return new Promise((resolve, reject) => {
    rl.addListener('line', onLine);
    rl.addListener('close', onClose);
    browserProcess.addListener('exit', onClose);
    browserProcess.addListener('error', onError);

    const timeoutId = timeout ? setTimeout(onTimeout, timeout) : 0;

    function onClose() {
      _onClose()
    }

    function onError(error: Error) {
      _onClose(error)
    }

    function _onClose(error?: Error): void {
      cleanup();
      reject(
        new Error(
          [
            'Failed to launch the browser process!' +
            (error ? ' ' + error.message : ''),
            stderr,
            '',
            'TROUBLESHOOTING: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md',
            '',
          ].join('\n')
        )
      );
    }

    function onTimeout(): void {
      cleanup();
      reject(
        new TimeoutError(
          `Timed out after ${timeout} ms while trying to connect to the browser! Only Chrome at revision r${version} is guaranteed to work.`
        )
      );
    }

    function onLine(line: string): void {
      stderr += line + '\n';
      const match = line.match(/^DevTools listening on (ws:\/\/.*)$/);
      if (!match) {
        return;
      }
      cleanup();
      // The RegExp matches, so this will obviously exist.
      resolve(match[1]!);
    }

    const cleanup = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      rl.removeListener('line', onLine);
      rl.removeListener('close', onClose);
      browserProcess.removeListener('exit', onClose);
      browserProcess.removeListener('error', onError);
    }
  });
}

export const BrowserFactory = <BrowserFactoryInterface>class Browser extends EventEmitter implements BrowserInterface {
  static async create(deps: BrowserDependencies): Promise<Browser> {
    const browser = new Browser(deps);
    await browser.setup();
    return browser;
  }

  protected _channel!: Channel;
  protected _targetManager!: TargetManager;


  // protected _browserProgress: ChildProcess;
  // protected _browserContext: BrowserContext;
  // protected _targetManager: TargetManager;
  constructor(protected _deps: BrowserDependencies) {
    super();
    // this._browserContext = this._deps.BrowserContextFactory.create({
    //   browser: this,
    //   channel: this._deps.ChannelFactory,
    // })
  }

  async setup(): Promise<void> {
    debugBrowser('setup start...');
    const { ChannelFactory, TargetFactory, TargetManagerFactory, PageFactory, FrameFactory, FrameManagerFactory } = this._deps;
    const url = await waitForWSEndpoint({
      timeout: defaultTimeout,
      version: '0.1.0',
      browserProcess: this._deps.process,
    });
    this._channel = await ChannelFactory.create({ url, SessionFactory: this._deps.SessionFactory });
    this._targetManager = await TargetManagerFactory.create({
      channel: this._channel,
      TargetFactory,
      PageFactory,
      FrameFactory,
      FrameManagerFactory
    });
    debugBrowser('setup done!');
    // const defaultContext = deps.BrowserContextFactory.create({
    //   channel,
    //   browser
    // });
  }

  teardown(): void | Promise<void> {
    
  }

  // async pages(): Promise<Page[]> {
  //   return this._browserContext.pages();
  // }

  // targets(): Target[] {
  //   return Array.from(
  //     this._deps.targetManager.getAvailableTargets().values()
  //   ).filter(target => {
  //     return target._isInitialized;
  //   });
  // }

  async newPage(): Promise<Page> {
    const contextId = undefined;
    const target = await this._targetManager.createTarget({
      url: 'about:blank',
      browserContextId: contextId || undefined,
    });

    const page = await target.page();
    if (!page) {
      throw new Error(
        `Failed to create a page for context (id = ${contextId})`
      );
    }
    return page!;
  }

  // protected _launch() {
  //   const stdio: Array<'pipe' | 'ignore'> = ['pipe', 'ignore', 'pipe'];
  //   return spawn(path, args, {
  //     detached: process.platform !== 'win32',
  //     stdio,
  //     env: process.env,
  //   });
  // }


}

// const browser = new Browser();

// const browserWSEndpoint = await browser.waitForWSEndpoint({
//   timeout: 30_000,
//   version: '0.1.0'
// })

// const channel = await Channel.create(browserWSEndpoint);

// await channel.send('Target.setDiscoverTargets', {
//   discover: true,
//   filter: [{type: 'tab', exclude: true}, {}],
// })
// // console.log('ret', browserWSEndpoint, channel);
// const { targetId } = await channel.send('Target.createTarget', {
//   browserContextId: undefined,
//   url: 'about:blank',
// });

// const naviateRet = await channel.send('Page.navigate', {
//   url: 'https://www.baidu.com',
// });

// console.log('targetId', targetId, naviateRet)

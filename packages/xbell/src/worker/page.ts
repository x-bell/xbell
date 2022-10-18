import type {
  BrowserContext as PWBroContext,
  Page as PWPage,
  Request,
} from 'playwright-core';

import type {
  XBellPage,
} from '../types/page';

import type {
  FrameGotoOptions,
  Response,
  LifecycleEvent,
  PageScreenshotOptions,
} from '../types/pw'
import { workerContext } from './worker-context';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { get } from '../utils/http';
import debug from 'debug';
import { Locator } from './locator';
import { ElementHandle } from './element-handle';
import type { Mouse } from '../types/mouse';
import { Keyboard } from './keyboard';

const debugPage = debug('xbell:page');

export class Page implements XBellPage {
  static async from<T extends (args: any) => any>(browserContext: PWBroContext, browserCallback: T[]) {
    const _page = await browserContext.newPage();
    const page = new Page(_page, browserCallback);
    await page.setup()
    return page;
  }

  public keyboard: Keyboard;

  public mouse: Mouse;

  // protected _settingPromise: Promise<void>;

  constructor(
    protected _page: PWPage,
    protected _browserCallbacks: Array<(args: any) => any>,
  ) {
    this.keyboard = new Keyboard(this._page.keyboard);
    this.mouse = this._page.mouse;
  }

  async setup() {
    await this._setting();
    let handle: {
      evaluateHandle: PWPage['evaluateHandle']
      evaluate: PWPage['evaluate']
    } = this._page;
    for (const browserCallback of this._browserCallbacks) {
      handle = await handle.evaluateHandle(browserCallback);
    }

    this._page.evaluate = handle.evaluate;
    this._page.evaluateHandle = handle.evaluateHandle;
  }

  async _setting() {
    const { port } = await workerContext.channel.request('queryServerPort',);
    this._page.route((new RegExp(XBELL_BUNDLE_PREFIX)), async (route, request) => {
      const url = request.url();
      // if (url.includes('@vite/client')) {
      //   route.continue()
      //   // route.fulfill({
      //   //     status: 200,
      //   //     headers: {
      //   //       'content-type': 'application/javascript'
      //   //     },
      //   //     // mock vite hmr, don't throw error
      //   //     body: 'const createHotContext = () => {}; const removeStyle = () => {}; const updateStyle = () => {}; export { createHotContext, removeStyle, updateStyle };'
      //   // });
      //   return;
      // }
      const urlObj = new URL(url)
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      const { body, contentType } = await get(urlObj.href)
      route.fulfill({
        status: 200,
        contentType,
        body,
      })
    });

    // this._page.route((url) => {
    //   console.log('url function');
    //   return true;
    // }, (route) => {
    //   route.continue();
    // });

    // this._page.route('/' + XBELL_BUNDLE_PREFIX + '/' + '', (route) => {
    //   route.fulfill({
    //     status: 200,
    //     contentType: 'application/javascript',
    //     // mock vite hmr, don't throw error
    //     body: `export cosnt createHotContext = () => {};`
    //   });
    // });

  }

  async _settingGotoRoute(url: string, html: string) {
    const { html: finalHtml } = await workerContext.channel.request('transformHtml', { html, url });
    await this._page.route(url, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: finalHtml,
      });
    });
  }

  async goto(url: string, options?: FrameGotoOptions | undefined): Promise<Response | null> {
    if (options?.html) {
      await this._settingGotoRoute(url, options.html);
    }
    const { html, ...otherOptons } = options || {};
    debugPage('goto', url);
    // TODO: playwright version
    // @ts-ignore
    return this._page.goto(url, otherOptons);
  }

  goBack() {
    return this._page.goBack();
  }

  getByText(text: string): Locator {
    return new Locator(this._page.locator(`text=${text}`));
  }

  getByClass(className: string): Locator {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._page.locator(cls));
  }

  getByTestId(testId: string): Locator {
    return new Locator(this._page.locator(`data-testid=${testId}`));
  }

  async queryByText(text: string): Promise<ElementHandle | null> {
    const elmentHandle = await this._page.$(`text=${text}`);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  async queryByClass(className: string): Promise<ElementHandle | null> {
    const cls = className.startsWith('.') ? className : `.${className}`;
    const elmentHandle = await this._page.$(cls);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  async queryByTestId(testId: string): Promise<ElementHandle | null> {
    const elmentHandle = await this._page.$(`data-testid=${testId}`);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  close() {
    return this._page.close()
  }

  async evaluate<Args>(browserFunction: Function, args: Args) {
    const { code: targetCode } = await workerContext.channel.request(
      'transformBrowserCode',
      { code: browserFunction.toString() }
    );
    const funcBody = `return (${targetCode.replace(/\}\;[\s\S]*$/, '}')})`;
    const func = new Function(funcBody);
    return this._page.evaluate(func(), args);
  }

  screenshot(options?: PageScreenshotOptions | undefined): Promise<Buffer> {
    return this._page.screenshot(options);
  }

  async url(): Promise<string> {
    return this._page.url();
  }

  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'> | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return this._page.waitForLoadState(state, options); 
  }

  waitForNavigation(options?: { timeout?: number | undefined; url?: string | RegExp | ((url: URL) => boolean) | undefined; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' | undefined; } | undefined): Promise<Response | null> {
    return this._page.waitForNavigation(options);
  }

  waitForResponse(urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Response> {
    return this._page.waitForResponse(urlOrPredicate, options);
  }

  waitForRequest(urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    return this._page.waitForRequest(urlOrPredicate, options);
  }
}

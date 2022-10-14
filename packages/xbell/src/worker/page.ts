import type {
  BrowserContext as PWBroContext,
  Page as PWPage,
} from 'playwright-core';

import type {
  XBellPage,
} from '../types';

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

const debugPage = debug('xbell:page');

export class Page implements XBellPage {
  static async from(browserContext: PWBroContext) {
    const page = await browserContext.newPage();
    return new Page(page);
  }

  protected _settingPromise: Promise<void>;

  constructor(protected _page: PWPage) {
    this._settingPromise = this._setting();
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

  locateByText(text: string): Locator {
    return new Locator(this._page.locator(`text=${text}`));
  }

  locateByClass(className: string): Locator {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._page.locator(cls));
  }

  locateByTestId(testId: string): Locator {
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

  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'> | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return this._page.waitForLoadState(state, options); 
  }

  screenshot(options?: PageScreenshotOptions | undefined): Promise<Buffer> {
    return this._page.screenshot(options);
  }
}

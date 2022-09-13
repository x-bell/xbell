import type {
  BrowserContext as PWBroContext,
  Locator as PWLocator,
  Page as PWPage,
  ElementHandle as PWElementHandle,
} from 'playwright-core';

import type {
  XBellPage,
  XBellLocator,
  XBellElementHandle,
} from '../types';

import type {
  ElementHandleCheckOptions,
  ElementHandleClickOptions,
  ElementHandleDblclickOptions,
  ElementHandleHoverOptions,
  ElementHandleUncheckOptions,
  FrameGotoOptions,
  Rect,
  TimeoutOptions,
  Response,
  LifecycleEvent
} from '../types/pw'
import { workerContext } from './worker-context';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { get } from '../utils/http';
import debug from 'debug';

const debugPage = debug('xbell:page');

class ElementHandle implements XBellElementHandle {
  constructor(protected _elementHandle: PWElementHandle<SVGElement | HTMLElement>) {
  }

  focus(): Promise<void> {
    return this._elementHandle.focus();
  }

  hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    return this._elementHandle.hover(options);
  }

  click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    return this._elementHandle.click(options);
  }

  dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    return this._elementHandle.dblclick(options);
  }

  check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    return this._elementHandle.check(options);
  }

  uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    return this._elementHandle.uncheck(options);
  }

  isVisible(): Promise<boolean> {
    return this._elementHandle.isVisible();
  }

  isChecked() {
    return this._elementHandle.isChecked();
  }

  isDisabled(): Promise<boolean> {
    return this._elementHandle.isDisabled();
  }

  isHidden(): Promise<boolean> {
    return this._elementHandle.isHidden();
  }

  boundingBox(): Promise<Rect | null> {
    return this._elementHandle.boundingBox();
  }
}

class Locator implements XBellLocator {
  constructor(protected _locator: PWLocator) {}

  isChecked(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isChecked(options)
  }

  isVisible(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isVisible(options)
  }

  isHidden(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isHidden(options)
  }

  isDisabled(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isDisabled(options)
  }

  click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    return this._locator.click(options);
  }

  dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    return this._locator.dblclick(options);
  }

  focus(options?: TimeoutOptions | undefined): Promise<void> {
    return this._locator.focus(options);
  }

  check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    return this._locator.check(options);
  }

  uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    return this._locator.check(options);
  }

  hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    return this._locator.hover(options);
  }

  boundingBox(options?: TimeoutOptions | undefined): Promise<Rect | null> {
    return this._locator.boundingBox(options);
  }
}

export class Page implements XBellPage<any> {
  static async from(browserContext: PWBroContext, filename: string) {
    const page = await browserContext.newPage();
    return new Page(page, filename);
  }

  protected _settingPromise: Promise<void>;
  constructor(protected _page: PWPage, protected _filename: string) {
    this._settingPromise = this._setting()
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

  locateByText(text: string): XBellLocator {
    return new Locator(this._page.locator(`text=${text}`));
  }

  async queryByText(text: string): Promise<XBellElementHandle | null> {
    const elmentHandle = await this._page.$(`text=${text}`);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  close() {
    return this._page.close()
  }

  async evaluate<Args>(browserFunction: Function, args: Args) {
    const { code: targetCode } = await workerContext.channel.request(
      'transformBrowserCode',
      { code: browserFunction.toString(), filename: this._filename }
    );
    const funcBody = `return (${targetCode.replace(/\}\;[\s\S]*$/, '}')})`;
    const func = new Function(funcBody);
    return this._page.evaluate(func(), args);
  }

  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'> | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return this._page.waitForLoadState(state, options); 
  }
}

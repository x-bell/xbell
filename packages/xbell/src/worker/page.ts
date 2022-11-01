import type {
  BrowserContext as PWBroContext,
  Page as PWPage,
  Request,
  Video,
} from 'playwright-core';

import type {
  XBellPage,
} from '../types/page';

import type {
  FrameGotoOptions,
  Response,
  LifecycleEvent,
  PageScreenshotOptions,
  PageFunction,
  SmartHandle,
} from '../types/pw'
import { workerContext } from './worker-context';
import { XBELL_BUNDLE_PREFIX, XBELL_ACTUAL_BUNDLE_PREFIX } from '../constants/xbell';
import { get } from '../utils/http';
import debug from 'debug';
import { Locator } from './locator';
import { ElementHandle } from './element-handle';
import type { Mouse } from '../types/mouse';
import { Keyboard } from './keyboard';
import { Console } from 'node:console';
import type { XBellMocks } from '../types/test';

const debugPage = debug('xbell:page');

interface EvaluateHandler {
  evaluateHandle: PWPage['evaluateHandle'];
  evaluate: PWPage['evaluate']
}

declare global {
  interface Window { __xbell_mocks__: Map<string, any>; }
}

export class Page implements XBellPage {
  static async from<T extends (args: any) => any>(browserContext: PWBroContext, browserCallback: T[], mocks: XBellMocks) {
    const _page = await browserContext.newPage();
    const page = new Page(_page, browserCallback, mocks);
    await page.setup()
    return page;
  }

  public keyboard: Keyboard;

  public mouse: Mouse;

  // protected _settingPromise: Promise<void>;

  constructor(
    protected _page: PWPage,
    protected _browserCallbacks: Array<(args: any) => any>,
    protected mocks: XBellMocks,
  ) {
    this.keyboard = new Keyboard(this._page.keyboard);
    this.mouse = this._page.mouse;
  }

  async setup() {
    await this._setting();
  }

  protected async _initPageEnv() {
    let handle: {
      evaluateHandle: PWPage['evaluateHandle']
      evaluate: PWPage['evaluate']
    } = this;
    // debugPage('initPageEnv.length', this._browserCallbacks.length);
    for (const browserCallback of this._browserCallbacks) {
      // debugPage('browser-callback', browserCallback.toString());
      handle = await handle.evaluateHandle(browserCallback);
    }
    // process.exit(0);
    // const hasLength = this._browserCallbacks.length;
    this.evaluate = handle.evaluate;
    this.evaluateHandle = handle.evaluateHandle;
    // debugPage('initPageEnv.done');
  }

  protected async _setting() {
    const { port } = await workerContext.channel.request('queryServerPort');
    const modulePaths = Array.from(this.mocks.keys());
    this._page.route(new RegExp(XBELL_ACTUAL_BUNDLE_PREFIX), async (route, request) => {
      const url = request.url();
      const urlObj = new URL(url);
      // const pathnameWithPrefix = urlObj.pathname.replace('/' + XBELL_BUNDLE_PREFIX, '')
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      const { body, contentType } = await get(urlObj.href.replace(XBELL_ACTUAL_BUNDLE_PREFIX, XBELL_BUNDLE_PREFIX));

      route.fulfill({
        status: 200,
        contentType,
        body,
      });
    });

    this._page.route((new RegExp(XBELL_BUNDLE_PREFIX)), async (route, request) => {
      const url = request.url();
      const urlObj = new URL(url);
      const pathnameWithoutPrefix = urlObj.pathname.replace('/' + XBELL_BUNDLE_PREFIX, '');
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
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      const { body, contentType } = await get(urlObj.href);
      // after get
      // const moduleUrls = await workerContext.channel.request('queryModuleUrl', modulePaths);
      // pre fetch url
      const moduleUrlMapByPath = await workerContext.channel.request('queryModuleUrl', modulePaths);
      const targetModule = moduleUrlMapByPath.find(item => item.url === pathnameWithoutPrefix);
      debugPage('moduleUrls', moduleUrlMapByPath, urlObj.href);
      const targetUrl = `${urlObj.pathname + urlObj.search}`.replace(XBELL_BUNDLE_PREFIX, XBELL_ACTUAL_BUNDLE_PREFIX);
      debugPage('targetModule', targetModule, targetUrl);
      if (targetModule) {
        const factory = this.mocks?.get(targetModule?.path);
        if (!factory) throw new Error(`The mocking path is "${targetModule.path}" missing factory function`)
        const obj = await this._page.evaluateHandle(factory);

        await obj.evaluate((factoryReturnValue, modulePath) => {
          if (!window.__xbell_mocks__) window.__xbell_mocks__ = new Map();
          window.__xbell_mocks__ = new Map();
          window.__xbell_mocks__.set(modulePath, factoryReturnValue);
          console.log('jsHandle', factoryReturnValue, modulePath);
        }, targetModule.path);
        const keys = Array.from((await obj.getProperties()).keys());
        debugPage('keys', keys);
        const exportPropertiesCodes = keys.map((key) => {
          return `export const ${key} = factory["${key}"];`
        });

        const body = [
          `const factory = window.__xbell_mocks__.get("${targetModule.path}");`,
          ...exportPropertiesCodes,
        ].join('\n');

        route.fulfill({
          status: 200,
          contentType,
          body,
        });
        route
      } else {
        route.fulfill({
          status: 200,
          contentType,
          body,
        });
      }
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
    // empty
    const { html: finalHtml } = await workerContext.channel.request('transformHtml', { html, url });

    // handle goto.html
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
    // debugPage('goto', url);
    // TODO: playwright version
    // @ts-ignore
    const ret = await this._page.goto(url, otherOptons);
    if (options?.html) {
      await this._initPageEnv();
    }

    return ret;
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

  protected async _transformBrowserFunction(browserFunction: Function | string) {
    const { code: targetCode } = await workerContext.channel.request(
      'transformBrowserCode',
      { code: browserFunction.toString() },
    );
    const funcBody = `return ${targetCode}`;
    const func = new Function(funcBody);
    Object.defineProperty(func, 'name', {
      value: '__xbell_browser_function__'
    });
    // func.name = '__xbell_browser_function__';
    return func() as Function;
  }

  // evaluate = async <R, Args>(pageFunction: PageFunction<{} & Args, R>, args?: Args): Promise<R> => {
  //   return this._evaluate(pageFunction, args, this._page);
  // }

  // evaluateHandle = async <R, Args>(pageFunction: PageFunction<{} & Args, R>, args?: Args | undefined): Promise<SmartHandle<R>> => {
  //   debugPage('evaluateHandle:before', pageFunction.toString());
  //   const func = await this._transformBrowserFunction(pageFunction);
  //   debugPage('evaluateHandle:after', func.toString());
  //   const ret: SmartHandle<R> = await this._page.evaluateHandle(func as any, args);
  //   const originEvaluate = ret.evaluate.bind(ret)
  //   const originEvaluateHandle = ret.evaluateHandle.bind(ret);
  //   type EH = typeof ret.evaluateHandle;
  //   type E = typeof ret.evaluateHandle;
  //   ret.evaluateHandle = async (...args: Parameters<EH>): Promise<ReturnType<EH>> => {
  //     const func = await this._transformBrowserFunction(args[0])
  //     return originEvaluateHandle(func as any, ...args.slice(1))
  //   };
  //   ret.evaluate = async (...args: Parameters<E>): Promise<ReturnType<E>> => {
  //     debugPage('originEvaluate:before', pageFunction.toString());
  //     const func = await this._transformBrowserFunction(args[0]);
  //     debugPage('originEvaluate:after', pageFunction.toString());
  //     return originEvaluate(func as any, ...args.slice(1));

  //   };

  //   return ret;
  // }

  protected _genEvaluate = (originEvaluate: EvaluateHandler['evaluate']) => async <R, Args>(pageFunction: PageFunction<{} & Args, R>, args?: Args): Promise<R> => {
    // debugPage('evaluate:before', pageFunction.toString());
    const func = await this._transformBrowserFunction(pageFunction);
    // debugPage('evaluate:after', func.toString());
    try {
      return await originEvaluate(func as any, args);
    } catch(error: any) {
      // debugPage('_genEvaluate:error',  error.stack?.split('\n'));
      throw error;
    }
  }

  protected _genEvaluateHandle = (originEvaluateHandle: EvaluateHandler['evaluateHandle']) => async <R, Args>(pageFunction: PageFunction<{} & Args, R>, args?: Args | undefined, ): Promise<SmartHandle<R>> => {
    // debugPage('evaluateHandle:before', pageFunction.toString());
    const func = await this._transformBrowserFunction(pageFunction);
    // debugPage('evaluateHandle:after', func.toString());
    try {
      const ret: SmartHandle<R> = await originEvaluateHandle(func as any, args);
      // debugPage('_genEvaluateHandle:ret');
      ret.evaluateHandle = this._genEvaluateHandle(ret.evaluateHandle.bind(ret));
      ret.evaluate = this._genEvaluate(ret.evaluate.bind(ret));
      return ret;
    } catch (error: any) {
      // fix error
      // debugPage('_genEvaluateHandle:error', error.stack?.split('\n').pop());
      throw error;
    }
    // const originEvaluate = ret.evaluate.bind(ret)
    // const originEvaluateHandle = ret.evaluateHandle.bind(ret);
    // type EH = typeof ret.evaluateHandle;
    // type E = typeof ret.evaluateHandle;
    // ret.evaluateHandle = this.evaluateHandle
    // ret.evaluate = async (...args: Parameters<E>): Promise<ReturnType<E>> => {
    //   debugPage('originEvaluate:before', pageFunction.toString());
    //   const func = await this._transformBrowserFunction(args[0]);
    //   debugPage('originEvaluate:after', pageFunction.toString());
    //   return originEvaluate(func as any, ...args.slice(1));

    // };
  }

  evaluate = this._genEvaluate(this._page.evaluate.bind(this._page));

  evaluateHandle = this._genEvaluateHandle(this._page.evaluateHandle.bind(this._page));

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

  async video(): Promise<Video | null> {
    return this._page.video();
  }
}

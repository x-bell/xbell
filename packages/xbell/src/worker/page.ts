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
import type { XBellBrowserCallback } from '../types/config';
import { idToUrl } from '../utils/path';
import { BrowserContext } from '../types/browser-context';

const debugPage = debug('xbell:page');

interface EvaluateHandler {
  evaluateHandle: PWPage['evaluateHandle'];
  evaluate: PWPage['evaluate']
}

declare global {
  interface Window {
    __xbell_context__: {
      importActual<T = any>(path: string): Promise<T>;
      mocks: Map<string, any>;
    }
    __xbell_getImportActualUrl__(path: string): Promise<string>;
    __xbell_page__: any;
  }
}

export class Page implements XBellPage {
  static async from({
    browserContext,
    browserCallbacks,
    mocks,
    filename,
    setupCalbacks,
  }: {
    browserContext: PWBroContext;
    setupCalbacks: XBellBrowserCallback[];
    browserCallbacks: XBellBrowserCallback[];
    mocks: XBellMocks;
    filename: string;
  }) {
    const _page = await browserContext.newPage();
    const page = new Page(_page, setupCalbacks, browserCallbacks, mocks, filename);
    await page.setup()
    return page;
  }

  public keyboard: Keyboard;

  public mouse: Mouse;

  protected _currentFilename: string;

  constructor(
    protected _page: PWPage,
    protected _setupCalbacks: XBellBrowserCallback[],
    protected _browserCallbacks: XBellBrowserCallback[],
    protected _mocks: XBellMocks,
    protected _filename: string,
  ) {
    this._currentFilename = _filename;
    this.keyboard = new Keyboard(this._page.keyboard);
    this.mouse = this._page.mouse;
  }

  async setup() {
    await this._setting();
  }

  protected async _setupXBellContext() {
    await this._page.exposeFunction('__xbell_getImportActualUrl__', async (modulePath: string) => {
      const id = await workerContext.channel.request('queryModuleId', {
        modulePath: modulePath,
        importer: this._currentFilename,
      });
      debugPage('execute.__xbell_getImportActualUrl__', modulePath, this._currentFilename, id);
      if (!id) {
        return null;
      }

      return idToUrl(id, XBELL_ACTUAL_BUNDLE_PREFIX);
    });

    await this._page.evaluate(() => {
      window.__xbell_context__ = {
        mocks: new Map(),
        importActual: async (path: string) => {
          const url = await window.__xbell_getImportActualUrl__(path);
          if (!url) {
            throw new Error(`[importActual]: Not found ${path}`);
          }
          return import(url);
        },
      };
    });
    debugPage('__xbell_context__ done');
  }

  protected async _setEvaluate(callbacks: XBellBrowserCallback[]) {
    let handle: {
      evaluateHandle: PWPage['evaluateHandle']
      evaluate: PWPage['evaluate']
    } = this;
    debugPage('_setEvaluate', callbacks.length);
    for (const { filename, callback } of callbacks) {
      this._currentFilename = filename;
      handle = await handle.evaluateHandle(callback);
    }
    this.evaluate = handle.evaluate;
    this.evaluateHandle = handle.evaluateHandle;
    this._currentFilename = this._filename;
  }

  protected async _setting() {
    const { port } = await workerContext.channel.request('queryServerPort');
    const modulePaths = Array.from(this._mocks.keys());

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
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      const { body, contentType } = await get(urlObj.href);
      // after get
      // const moduleUrls = await workerContext.channel.request('queryModuleUrl', modulePaths);
      // pre fetch url
      const moduleUrlMapByPath = await workerContext.channel.request('queryModuleUrls', modulePaths);
      const targetModule = moduleUrlMapByPath.find(item => item.url === pathnameWithoutPrefix);
      if (targetModule) {
        const factory = this._mocks?.get(targetModule?.path);
        if (!factory) throw new Error(`The mocking path is "${targetModule.path}" missing factory function`);
        const obj = await this.evaluateHandle(factory);

        await obj.evaluate((factoryReturnValue, modulePath) => {
          window.__xbell_context__.mocks.set(modulePath, factoryReturnValue);
        }, targetModule.path);
        const keys = Array.from((await obj.getProperties()).keys());
        debugPage('keys', keys);

        const exportPropertiesCodes = keys.map((key) => {
          return `export const ${key} = factory["${key}"];`
        });

        const body = [
          `const factory = window.__xbell_context__.mocks.get("${targetModule.path}");`,
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
      await this._setupXBellContext();
      await this._setEvaluate(this._setupCalbacks);
      await this._setEvaluate(this._browserCallbacks);
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

  context(): BrowserContext {
    return this._page.context();
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

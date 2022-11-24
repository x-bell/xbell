import type {
  BrowserContext as PWBroContext,
  Download,
  Page as PWPage,
  Video,
  Request as PWRequest,
  Response as PWResponse,
} from 'playwright-core';

import type {
  Page as PageInterface,
  Locator as LocatorInterface,
  FrameLocator as FrameLocatorInterface,
  ElementHandle as ElementHandleInterface,
  PageMethods,
  BrowserContext,
  XBellMocks,
  XBellBrowserCallback,
  Mouse
} from '../types';

import type {
  FrameGotoOptions,
  LifecycleEvent,
  PageScreenshotOptions,
  PageFunction,
  SmartHandle,
  TimeoutOptions,
  Request,
  Response,
} from '../types/pw'
import type { Channel } from '../common/channel';
import type { QueryItem } from '../browser-test/types';

import { XBELL_BUNDLE_PREFIX, XBELL_ACTUAL_BUNDLE_PREFIX } from '../constants/xbell';
import { get } from '../utils/http';
import { Locator, FrameLocator } from './locator';
import { ElementHandle } from './element-handle';
import { Keyboard } from './keyboard';
import { idToUrl } from '../utils/path';
import debug from 'debug';
import type { e2eMatcher } from './expect/matcher';
import type { ExpectMatchState } from '@xbell/assert';
import { isRegExp } from '../utils/is';


const debugPage = debug('xbell:page');

function toCommonRequest(r: PWRequest): Request {
  return {
    url: r.url(),
    headers: r.headers(),
  }
}

function toCommonResponse(r: PWResponse): Response {
  return {
    url: r.url(),
    headers: r.headers(),
    status: r.status(),
  }
}

function responseUrlOrPredicateToFunction(urlOrPredicate: string | RegExp | ((request: Response) => boolean | Promise<boolean>) | undefined): ((request: PWResponse) => Promise<boolean> | boolean) | undefined {
  if (typeof urlOrPredicate === 'function') return request => urlOrPredicate(toCommonResponse(request));
  if (isRegExp(urlOrPredicate)) return request => urlOrPredicate.test(request.url())
  if (typeof urlOrPredicate === 'string') return request => request.url() === urlOrPredicate;
  return undefined;
}

function requestUrlOrPredicateToFunction(urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>) | undefined): ((request: PWRequest) => Promise<boolean> | boolean) | undefined {
  if (typeof urlOrPredicate === 'function') return request => urlOrPredicate(toCommonRequest(request));
  if (isRegExp(urlOrPredicate)) return request => urlOrPredicate.test(request.url())
  if (typeof urlOrPredicate === 'string') return request => request.url() === urlOrPredicate;
  return undefined;
}

let uuid = 1;
function genUUID() {
  return String(uuid++);
}
interface EvaluateHandler {
  evaluateHandle: PWPage['evaluateHandle'];
  evaluate: PWPage['evaluate']
}

declare global {
  interface Window {
    __xbell_coverage__?: any;
    __xbell_context__: {
      importActual<T = any>(path: string): Promise<T>;
      mocks: Map<string, any>;
    }
    __xbell_page_callbacks__: Map<string, (...args: any[]) => any>;
    __xbell_getImportActualUrl__(path: string): Promise<string>;
    __xbell_page_screenshot__(): Promise<number[]>;
    __xbell_page_url__(): Promise<string>;
    __xbell_page_expect__<M extends keyof typeof e2eMatcher>(opts: {
      target?: any;
      type?: 'locator' | 'element' | 'page'
      uuid?: string;
      method: M;
      state: ExpectMatchState;
      args: Parameters<typeof e2eMatcher[M]> extends [any, ...infer P] ? P : Parameters<typeof e2eMatcher[M]>;
    }): Promise<{ message: string; pass: boolean; }>;
    __xbell_page_execute_with_callback__<T extends 'waitForResponse' | 'waitForRequest' | 'waitForRequestFailed' | 'waitForRequestFinished'>(opts: {
      callbackUUID: string;
      method: T;
      timeoutOptions?: TimeoutOptions;
    }): ReturnType<Page[T]>;

    __xbell_page_execute__<T extends keyof PageMethods>(opts: {
      method: T;
      args: Parameters<PageMethods[T]>;
    }): ReturnType<PageMethods[T]>
    // locator
    __xbell_page_locator_expose__(queryItems: QueryItem[]): Promise<{
      uuid: string;
    }>;
    __xbell_page_locator_execute__<T extends keyof LocatorInterface>(opts: {
      uuid: string;
      method: T;
      args: Parameters<LocatorInterface[T]>;
    }): ReturnType<LocatorInterface[T]>;
    __xbell_page_locator_execute__<T extends keyof FrameLocatorInterface>(opts: {
      uuid: string;
      method: T;
      args: Parameters<FrameLocatorInterface[T]>;
    }): ReturnType<FrameLocatorInterface[T]>;

    // __xbell_page_frame_locator_expose__(queryItems: QueryItem[]): Promise<{
    //   uuid: string;
    // }>;
    // __xbell_page_frame_locator_execute__<T extends keyof FrameLocator>(opts: {
    //   uuid: string;
    //   method: T;
    //   args: Parameters<FrameLocator[T]>;
    // }): ReturnType<FrameLocator[T]>;

    // element-handle
    __xbell_page_element_handle_expose__(queryItems: QueryItem[], uuid?: string): Promise<{
      uuid: string;
    } | null>;
    __xbell_page_element_handle_execute__<T extends keyof ElementHandleInterface>(opts: {
      uuid: string;
      method: T;
      args: Parameters<ElementHandleInterface[T]>;
    }): ReturnType<ElementHandleInterface[T]>;
  }
}

export function getLocatorByQueryItem(
  locator: PageInterface | LocatorInterface | FrameLocatorInterface,
  queryItem: QueryItem
): LocatorInterface | FrameLocatorInterface {
  if ('value' in queryItem) {
    const { type, value, isFrame } = queryItem;
    if (isFrame) {
      return locator.getFrame(value);
    }
    if (type === 'class') return locator.getByClass(value);
    if (type === 'testId') return locator.getByTestId(value);
    if (type === 'text') return locator.getByText(value);
    return locator.get(value);
  }
  const { method, args } = queryItem;
  return Reflect.apply((locator as LocatorInterface)[method], locator, args);
}

async function getElementHandleByQueryItem(locator: PageInterface | LocatorInterface | ElementHandleInterface, queryItem: QueryItem): Promise<ElementHandleInterface | LocatorInterface | null> {
  if ('value' in queryItem) {
    const { type, value, isElementHandle } = queryItem;
    // if (query)
    if (type === 'class') return isElementHandle ? locator.queryElementByText(value) : (locator as LocatorInterface).getByClass(value);
    if (type === 'testId') return isElementHandle ? locator.queryElementByTestId(value) : (locator as LocatorInterface).queryElementByTestId(value);
    // TODO: handle others
    return isElementHandle ? locator.queryElementByText(value) : (locator as LocatorInterface).getByText(value);
  }
  const { method, args } = queryItem;
  // @ts-ignore
  return (locator as LocatorInterface)[method](...args);
}

export class Page implements PageInterface {
  static async from({
    browserContext,
    browserCallbacks,
    mocks,
    filename,
    setupCalbacks,
    channel
  }: {
    browserContext: PWBroContext;
    setupCalbacks: XBellBrowserCallback[];
    browserCallbacks: XBellBrowserCallback[];
    mocks: XBellMocks;
    filename: string;
    channel?: Channel;
  }) {
    const _page = await browserContext.newPage();
    const page = new Page(_page, setupCalbacks, browserCallbacks, mocks, filename, channel);
    if (channel) {
      await page.setup()
    }
    return page;
  }

  public keyboard: Keyboard;

  public mouse: Mouse;

  protected _currentFilename: string;

  protected _locatorMap: Map<string, LocatorInterface | FrameLocatorInterface> = new Map();
  protected _elementHandleMap: Map<string, ElementHandleInterface> = new Map();
  protected _pendingRequestCount = 0;
  protected _isListenRequest = false;
  _viteAssetReload?: () => void;

  constructor(
    protected _page: PWPage,
    protected _setupCalbacks: XBellBrowserCallback[],
    protected _browserCallbacks: XBellBrowserCallback[],
    protected _mocks: XBellMocks,
    protected _filename: string,
    protected _channel?: Channel,
  ) {
    this._currentFilename = _filename;
    this.keyboard = new Keyboard(this._page.keyboard);
    this.mouse = this._page.mouse;
  }

  protected async setup() {
    await this._proxyRoutes();
  }

  async _setupExpose() {
    await this._page.exposeFunction('__xbell_getImportActualUrl__', async (modulePath: string) => {
      const id = await this._channel!.request('queryModuleId', {
        modulePath: modulePath,
        importer: this._currentFilename,
      });
      // debugPage('execute.__xbell_getImportActualUrl__', modulePath, this._currentFilename, id);
      if (!id) {
        return null;
      }

      return idToUrl(id, XBELL_ACTUAL_BUNDLE_PREFIX);
    });
    await this._page.exposeFunction('__xbell_page_execute_with_callback__', ({ timeoutOptions, callbackUUID, method }: Parameters<typeof window.__xbell_page_execute_with_callback__>[0]): ReturnType<typeof window.__xbell_page_execute_with_callback__> => {
        return this[method]((requestOrResponse) => {
          return this._originEvaluate(({ callbackUUID, res }) => {
            // @ts-ignore
            const func = window.__xbell_page_callbacks__.get(callbackUUID)!
            return func(res) as boolean;
          }, { callbackUUID: callbackUUID, res: requestOrResponse })
        }, timeoutOptions);
    });
    await this._page.exposeFunction(
      '__xbell_page_execute__',
      (options: Parameters<typeof window.__xbell_page_execute__>[0]): ReturnType<typeof window.__xbell_page_execute__> => {
        const { method, args } = options;
        return Reflect.apply(this[method], this, args);
      }
    );

    // locator
    await this._page.exposeFunction(
      '__xbell_page_locator_expose__',
      (queryItems: QueryItem[]): Awaited<ReturnType<typeof window.__xbell_page_locator_expose__>> => {
        const [firstQuery, ...rest] = queryItems;
        const locator = rest.reduce((locator, query) => getLocatorByQueryItem(locator, query), getLocatorByQueryItem(this, firstQuery));
        const uuid = genUUID();
        this._locatorMap.set(uuid, locator);
        return {
          uuid,
        };
      }
    );

    await this._page.exposeFunction(
      '__xbell_page_locator_execute__',
      (options: Parameters<typeof window.__xbell_page_locator_execute__>[0]) => {
        // TODO: snapshot
        const { uuid, method, args } = options;
        const locator = this._locatorMap.get(uuid)!
        return Reflect.apply(locator[method], locator, args);
      }
    );

    // element handle
    await this._page.exposeFunction(
      '__xbell_page_element_handle_expose__',
      async (queryItems: QueryItem[], uuid?: string): ReturnType<typeof window.__xbell_page_element_handle_expose__> => {
        let elementHandle: PageInterface | ElementHandleInterface | null = uuid ? this._elementHandleMap.get(uuid)! : this;
        // TODO: handle empty array
        for (const queryItem of queryItems) {
          if (!elementHandle) break;
          elementHandle = await getElementHandleByQueryItem(elementHandle, queryItem)
        }

        if (elementHandle) {
          const uuid = genUUID();
          this._elementHandleMap.set(uuid, elementHandle as ElementHandleInterface);
          return {
            uuid,
          };
        }

        return null;
      }
    );

    await this._page.exposeFunction(
      '__xbell_page_element_handle_execute__',
      (options: Parameters<typeof window.__xbell_page_element_handle_execute__>[0]) => {
        // TODO: snapshot
        const { uuid, method, args } = options;
        const locator = this._elementHandleMap.get(uuid)!
        return Reflect.apply(locator[method], locator, args);
      }
    );

    await this._page.exposeFunction('__xbell_page_screenshot__', async (...args: Parameters<PageInterface['screenshot']>) => {
      const buffer = await this._page.screenshot(...args)
      return Array.from(buffer);
    });

    const { e2eMatcher } = await import('./expect/matcher');
    this._page.exposeFunction('__xbell_page_expect__', async (opts: Parameters<typeof window.__xbell_page_expect__>[0]): ReturnType<typeof window.__xbell_page_expect__> => {
      const { type, uuid, method, args, state, target: obj } = opts;
      const target = (() => {
        if (obj) return obj;
        if (type === 'element') return this._elementHandleMap.get(uuid!)!;
        if (type === 'locator') return this._locatorMap.get(uuid!);
        return this;
      })();
      // @ts-ignore
      const ret = await e2eMatcher[method](target as LocatorInterface, ...args)(state)
      // @ts-ignore
      const msg = ret.message(state);
      const pass = ret.pass;
      return {
        pass,
        message: msg,
      };
    });
  }

  protected async _setupXBellContext() {
    await this._page.evaluate(() => {
      window.__xbell_page_callbacks__ = new Map();
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
  }

  protected async _setEvaluate(callbacks: XBellBrowserCallback[]) {
    let handle: {
      evaluateHandle: PWPage['evaluateHandle']
      evaluate: PWPage['evaluate']
    } = this;
    for (const { filename, callback } of callbacks) {
      this._currentFilename = filename;
      handle = await handle.evaluateHandle(callback);
    }
    this.evaluate = handle.evaluate;
    this.evaluateHandle = handle.evaluateHandle;
    this._currentFilename = this._filename;
  }

  protected _onRequest = () => {
    ++this._pendingRequestCount;
    debugPage('onRequestStart', this._pendingRequestCount);
  }

  protected _onRequestDone = () => {
    --this._pendingRequestCount;
    debugPage('onRequestDone', this._pendingRequestCount);
  }
  protected _listenRequests() {
    if (this._isListenRequest) {
      this._page.removeListener('request', this._onRequest);
      this._page.removeListener('requestfailed', this._onRequestDone);
      this._page.removeListener('requestfinished', this._onRequestDone);
    }
    this._isListenRequest = true;
    this._pendingRequestCount = 0;
    this._page.on('request', this._onRequest);
    this._page.on('requestfailed', this._onRequestDone);
    this._page.on('requestfinished', this._onRequestDone);
  }

  protected async _proxyRoutes() {
    const channle = this._channel!;
    const { port } = await channle.request('queryServerPort');
    const modulePaths = Array.from(this._mocks.keys());

    this._page.route(new RegExp(XBELL_ACTUAL_BUNDLE_PREFIX), async (route, request) => {
      const url = request.url();
      const urlObj = new URL(url);
      // const pathnameWithPrefix = urlObj.pathname.replace('/' + XBELL_BUNDLE_PREFIX, '')
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      try {
        const { body, contentType } = await get(urlObj.href.replace(XBELL_ACTUAL_BUNDLE_PREFIX, XBELL_BUNDLE_PREFIX));
        route.fulfill({
          status: 200,
          contentType,
          body,
        });
      } catch (err) {
        if ((err as any).statusCode === 504 && this._viteAssetReload) {
          this._viteAssetReload();
        }
        throw err;
      }
    });

    this._page.route((new RegExp(XBELL_BUNDLE_PREFIX)), async (route, request) => {
      const url = request.url();
      const urlObj = new URL(url);
      const pathnameWithoutPrefix = urlObj.pathname.replace('/' + XBELL_BUNDLE_PREFIX, '');
      urlObj.protocol = 'http';
      urlObj.hostname = 'localhost';
      urlObj.port = String(port);
      try {
        const { body, contentType } = await get(urlObj.href);
        const moduleUrlMapByPath = await channle.request('queryModuleUrls', modulePaths);
        const targetModule = moduleUrlMapByPath.find(item => item.url === pathnameWithoutPrefix);
        if (targetModule) {
          const factory = this._mocks?.get(targetModule?.path);
          if (!factory) throw new Error(`The mocking path is "${targetModule.path}" missing factory function`);
          const obj = await this.evaluateHandle(factory);

          await obj.evaluate((factoryReturnValue, modulePath) => {
            window.__xbell_context__.mocks.set(modulePath, factoryReturnValue);
          }, targetModule.path);
          const keys = Array.from((await obj.getProperties()).keys());
          // debugPage('keys', keys);

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
      } catch (err) {
        if ((err as any).statusCode === 504 && this._viteAssetReload) {
          this._viteAssetReload();
        }
        throw err;
      }
    });
  }

  protected async _proxyGotoRoute(url: string, html: string) {
    // empty
    const { html: finalHtml } = await this._channel!.request('transformHtml', { html, url });

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
    if (options?.mockHTML && this._channel) {
      await this._proxyGotoRoute(url, options.mockHTML);
    }
    const { mockHTML, ...otherOptons } = options || {};
    // debugPage('goto', url);
    // TODO: playwright version
    // @ts-ignore
    const ret = await this._page.goto(url, otherOptons);
    this._listenRequests();
    return ret ? toCommonResponse(ret) : ret;
  }

  async _setupBrowserEnv() {
    this.evaluate = this._originEvaluate;
    this.evaluateHandle = this._originEvaluateHandle;
    if (this._channel) await this._setupXBellContext();
    if (this._setupCalbacks.length) await this._setEvaluate(this._setupCalbacks);
    if (this._browserCallbacks.length) await this._setEvaluate(this._browserCallbacks);
  }

  goBack() {
    return this._page.goBack();
  }

  async reload(options?: { timeout?: number | undefined; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' | undefined; }): Promise<Response | null> {
    const ret = await this._page.reload(options);
    this._listenRequests();
    return ret ? toCommonResponse(ret) : ret;
  }

  getFrame(selector: string): FrameLocatorInterface {
    return new FrameLocator(this._page.frameLocator(selector));
  }
  
  get(selector: string): LocatorInterface {
    return new Locator(this._page.locator(selector));
  }

  getByText(text: string): LocatorInterface {
    return new Locator(this._page.locator(`text=${text}`));
  }

  getByClass(className: string): Locator {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._page.locator(cls));
  }

  getByTestId(testId: string): Locator {
    return new Locator(this._page.locator(`data-testid=${testId}`));
  }

  async queryElementByText(text: string): Promise<ElementHandle | null> {
    const elmentHandle = await this._page.$(`text=${text}`);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  async queryElementByClass(className: string): Promise<ElementHandle | null> {
    const cls = className.startsWith('.') ? className : `.${className}`;
    const elmentHandle = await this._page.$(cls);
    return elmentHandle ? new ElementHandle(elmentHandle) : null;
  }

  async queryElementByTestId(testId: string): Promise<ElementHandle | null> {
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
    const channel = this._channel;
    if (!channel) {
      return browserFunction;
    }

    const { code: targetCode } = await channel.request(
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

  _originEvaluate = this.evaluate;

  evaluateHandle = this._genEvaluateHandle(this._page.evaluateHandle.bind(this._page));

  _originEvaluateHandle = this.evaluateHandle;

  screenshot(options?: PageScreenshotOptions | undefined): Promise<Buffer> {
    return this._page.screenshot(options);
  }

  url(): Promise<string> {
    return Promise.resolve(this._page.url());
  }

  title(): Promise<string> {
    return this._page.title();
  }

  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'> | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return this._page.waitForLoadState(state, options); 
  }

  async waitForNavigation(options?: { timeout?: number | undefined; url?: string | RegExp | ((url: URL) => boolean) | undefined; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' | undefined; } | undefined): Promise<Response | null> {
    const ret = await this._page.waitForNavigation(options);
    return ret ? toCommonResponse(ret) : ret;;
  }

  async waitForResponse(urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Response> {
    const ret = await this._page.waitForResponse(responseUrlOrPredicateToFunction(urlOrPredicate)!, options);
    return ret ? toCommonResponse(ret) : ret;
  }

  async waitForRequest(urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const ret = await this._page.waitForRequest(requestUrlOrPredicateToFunction(urlOrPredicate)!, options);
    return ret ? toCommonRequest(ret) : ret;
  }

  waitForRequestIdle(options?: TimeoutOptions) {
    return new Promise<void>((resolve, reject) => {
      let isResolved = false;
      const timeout = options?.timeout ?? 30_000;
      setTimeout(() => {
        if (!isResolved) reject(new Error(`waitForRequestIdle timeout over ${timeout}ms`));
      }, timeout);

      let lastRequestDate = Date.now();
      const currentSets = new Set<PWRequest>();

      const onRequest = (request: PWRequest) => {
        currentSets.add(request);
      };

      const onRequestDone = (request: PWRequest) => {
        lastRequestDate = Date.now();
        currentSets.delete(request);
        maybeDoResolve();
      };
      
      const maybeDoResolve = () => {
        if (this._pendingRequestCount === 0 && currentSets.size === 0 && Date.now() - lastRequestDate >= 500) {
          this._page.removeListener('request', onRequest);
          this._page.removeListener('requestfailed', onRequestDone);
          this._page.removeListener('requestfinished', onRequestDone);
          isResolved = true;
          resolve();
        } else {
          setTimeout(maybeDoResolve, Date.now() + 500 - lastRequestDate);
        }
      }

      this._page.on('request', onRequest);
      this._page.on('requestfailed', onRequestDone);
      this._page.on('requestfinished', onRequestDone);
    });
  }

  async waitForRequestFailed(urlOrPredicate?: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const ret = await this._page.waitForEvent('requestfailed', {
      predicate: requestUrlOrPredicateToFunction(urlOrPredicate),
      ...options,
    });
    return ret ? toCommonRequest(ret) : ret;

  }

  async waitForRequestFinished(urlOrPredicate?: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const ret = await this._page.waitForEvent('requestfinished', {
      predicate: requestUrlOrPredicateToFunction(urlOrPredicate),
      ...options,
    });
    return ret ? toCommonRequest(ret) : ret;
  }

  waitForDownload(optionsOrPredicate?: { predicate?: ((download: Download) => boolean | Promise<boolean>) | undefined; timeout?: number | undefined; } | ((download: Download) => boolean | Promise<boolean>) | undefined): Promise<Download> {
    return this._page.waitForEvent('download', optionsOrPredicate);
  }

  async video(): Promise<Video | null> {
    return this._page.video();
  }
}

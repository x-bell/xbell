// import { Request, Response } from 'playwright-core';
import type {
  CommonPage,
  Page as PageInterface,
  PageMethods,
  Locator as LocatorInterface,
  FrameLocator as FrameLocatorInterface,
  ElementHandle as ElementHandleInterface
} from '../types';
import type { FrameGotoOptions, PageFunction, PageScreenshotOptions, Response, Request, TimeoutOptions } from '../types/pw';
import { Locator, FrameLocator } from './locator';
import { getElementHandle } from './element-handle';
import { genUUID } from './utils';
export class Page implements CommonPage {
  private _type = 'page';
  private async _execute<T extends keyof PageMethods>(method: T, ...args: Parameters<PageMethods[T]>): Promise<ReturnType<PageMethods[T]>> {
    return window.__xbell_page_execute__({
      method,
      args,
    });
  }

  get(selector: string): LocatorInterface {
    return new Locator([{
      value: selector,
    }])
  }

  getByClass(className: string): LocatorInterface {
    return new Locator([{
      type: 'class',
      value: className,
    }])
  }

  getByTestId(testId: string): LocatorInterface {
    return new Locator([{
      type: 'testId',
      value: testId,
    }]);
  }

  getByText(text: string): LocatorInterface {
    return new Locator([{
      type: 'text',
      value: text,
    }]);
  }

  getFrame(selector: string): FrameLocatorInterface {
    return new FrameLocator([{
      isFrame: true,
      value: selector,
    }]);
  }
  // goto(url: string, options?: FrameGotoOptions | undefined): Promise<Response | null> {

  // }
  
  async screenshot(options?: PageScreenshotOptions | undefined): Promise<Uint8Array> {
    const buffer = await window.__xbell_page_screenshot__();
    return new Uint8Array(buffer);
  }

  async waitForRequest(urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const isFunction = typeof urlOrPredicate === 'function';
    if (isFunction) {
      const callbackUUID = genUUID()
      return window.__xbell_page_execute_with_callback__({
        callbackUUID,
        method: 'waitForRequest',
        timeoutOptions: options,
      });
    }

    return await this._execute('waitForRequest', urlOrPredicate, options);
  }

  async waitForRequestFailed(urlOrPredicate?: string | RegExp | ((request: Request) => boolean | Promise<boolean>) | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const isFunction = typeof urlOrPredicate === 'function';
    if (isFunction) {
      const callbackUUID = genUUID()
      return window.__xbell_page_execute_with_callback__({
        callbackUUID,
        method: 'waitForRequestFailed',
        timeoutOptions: options,
      });
    }
    return await this._execute('waitForRequestFailed', urlOrPredicate, options);
  }

  async waitForRequestFinished(urlOrPredicate?: string | RegExp | ((request: Request) => boolean | Promise<boolean>) | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    const isFunction = typeof urlOrPredicate === 'function';
    if (isFunction) {
      const callbackUUID = genUUID()
      window.__xbell_page_callbacks__.set(callbackUUID, urlOrPredicate);
      return window.__xbell_page_execute_with_callback__({
        callbackUUID,
        method: 'waitForRequestFinished',
        timeoutOptions: options,
      });
    }
    return await this._execute('waitForRequestFinished', urlOrPredicate, options);
  }

  async waitForRequestIdle(options?: TimeoutOptions | undefined): Promise<void> {
    return await this._execute('waitForRequestIdle', options);
  }

  // async waitForRequestFinished(optionsOrPredicate?: { predicate?: ((request: Request) => boolean | Promise<boolean>) | undefined; timeout?: number | undefined; } | ((request: Request) => boolean | Promise<boolean>) | undefined): Promise<Request> {
  //   const isFunction = typeof optionsOrPredicate === 'function' || typeof optionsOrPredicate?.predicate === 'function';
  //   if (!isFunction) {
  //     return await this._execute('waitForRequestFinished', optionsOrPredicate);
  //   }
  // }

  async waitForResponse(urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Response> {
    const isFunction = typeof urlOrPredicate === 'function';
    if (isFunction) {
      const callbackUUID = genUUID()
      window.__xbell_page_callbacks__.set(callbackUUID, urlOrPredicate);
      return window.__xbell_page_execute_with_callback__({
        callbackUUID,
        method: 'waitForResponse',
        timeoutOptions: options,
      });
    }
    return await this._execute('waitForResponse', urlOrPredicate, options);
  }

  // waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle' | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    
  // }

  // waitForNavigation(options?: { timeout?: number | undefined; url?: string | RegExp | ((url: URL) => boolean) | undefined; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' | undefined; } | undefined): Promise<Response | null> {
    
  // }

  // waitForResponse(urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Response> {
    
  // }

  // waitForRequest(urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>), options?: { timeout?: number | undefined; } | undefined): Promise<Request> {
    
  // }

  queryElementByClass(className: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'class',
      value: className,
      isElementHandle: true,
    }]);
  }

  queryElementByTestId(testId: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'testId',
      value: testId,
      isElementHandle: true,
    }]);
  }

  queryElementByText(text: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'text',
      value: text,
      isElementHandle: true,
    }]);
  }

  async url(): Promise<string> {
    return await this._execute('url');
  }

  async title(): Promise<string> {
    return await this._execute('title');
  }

  async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle' | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return await this._execute('waitForLoadState', state, options);
  }
}

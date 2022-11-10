import { Request, Response } from 'playwright-core';
import { CommonPage, Page as PageInterface, PageMethods, Locator as LocatorInterface, ElementHandle as ElementHandleInterface } from '../types';
import { FrameGotoOptions, PageFunction, PageScreenshotOptions } from '../types/pw';
import { Locator } from './locator';
import { getElementHandle } from './element-handle';

export class Page implements CommonPage {

  private async _execute<T extends keyof PageMethods>(method: T, ...args: Parameters<PageMethods[T]>): Promise<ReturnType<PageMethods[T]>> {
    return window.__xbell_page_execute__({
      method,
      args,
    });
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
  // goto(url: string, options?: FrameGotoOptions | undefined): Promise<Response | null> {

  // }
  
  async screenshot(options?: PageScreenshotOptions | undefined): Promise<Uint8Array> {
    const buffer = await window.__xbell_page_screenshot__();
    return new Uint8Array(buffer);
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
    }]);
  }

  queryElementByTestId(testId: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'testId',
      value: testId,
    }]);
  }

  queryElementByText(text: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'text',
      value: text,
    }]);
  }

  url(): Promise<string> {
    return window.__xbell_page_url__();
  }

  async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle' | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return await this._execute('waitForLoadState', state, options);
  }
}

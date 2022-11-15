import type {
  FrameGotoOptions,
  Response,
  LifecycleEvent,
  PageScreenshotOptions,
  Request,
  SmartHandle,
  PageFunction,
  Video,
} from './pw';
import type { Locator } from './locator';
import type { FrameLocator } from './frame-locator';
import type { ElementHandle } from './element-handle';
import type { Mouse } from './mouse';
import type { Keyboard } from './keyboard';
import type { BrowserContext } from './browser-context';
// import { Page as PWPage } from 'playwright-core';

// const page: PWPage;

// page.frameLocator().fmra()

export interface CommonPage {
  screenshot(options?: PageScreenshotOptions): Promise<Uint8Array>;
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getByClass(className: string): Locator;
  get(selector: string): Locator;
  getFrame(selector: string): FrameLocator;
  queryElementByText(text: string): Promise<ElementHandle | null>;
  queryElementByTestId(testId: string): Promise<ElementHandle | null>;
  queryElementByClass(className: string): Promise<ElementHandle | null>;
  url(): Promise<string>;
  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'>, options?: { timeout?: number }): Promise<void>;
}

export interface Page<BrowserExtensionArg = {}> extends CommonPage {
  keyboard: Keyboard;
  mouse: Mouse;
  evaluate<R, Args>(pageFunction: PageFunction<BrowserExtensionArg & Args, R>, arg?: Args): Promise<R>;
  evaluateHandle: <R, Args>(pageFunction: PageFunction<BrowserExtensionArg & Args, R>, args?: Args) => Promise<SmartHandle<R>>;
  close(): Promise<void>;
  goto(url: string, options?: FrameGotoOptions): Promise<Response | null>;
  waitForNavigation(options?: {
    timeout?: number;
    url?: string | RegExp|((url: URL) => boolean);
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  }): Promise<null | Response>;
  waitForRequest(urlOrPredicate: string| RegExp | ((request: Request) => boolean | Promise<boolean>), options?: {
    timeout?: number;
  }): Promise<Request>;
  waitForResponse(urlOrPredicate: string| RegExp | ((response: Response) => boolean| Promise<boolean>), options?: {
    timeout?: number;
  }): Promise<Response>;
  video(): Promise<Video | null>;
  context(): BrowserContext;
  reload(options: {
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  }): Promise<Response | null>;
}

export type PageMethods = Omit<Page, 'mouse' | 'keyboard'>;

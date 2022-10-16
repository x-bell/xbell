import type {
  FrameGotoOptions,
  Response,
  LifecycleEvent,
  PageScreenshotOptions,
  Request,
} from './pw';
import type { XBellLocator } from './locator';
import type { XBellElementHandle } from './element-handle';
import type { Mouse } from './mouse';
import type { Keyboard } from './keyboard';

interface XBellPageExecutor<BrowserExtensionArg> {
  (arg: BrowserExtensionArg): void;
}

export interface XBellPage<BrowserExtensionArg = {}> {
  evaluate: <Args>(func: XBellPageExecutor<BrowserExtensionArg & Args>, args?: Args) => void;
  close(): Promise<void>;
  goto(url: string, options?: FrameGotoOptions): Promise<Response | null>;
  waitForLoadState(state?: Exclude<LifecycleEvent, 'commit'>, options?: { timeout?: number }): Promise<void>;
  screenshot(options?: PageScreenshotOptions): Promise<Buffer>
  getByText(text: string): XBellLocator;
  getByTestId(testId: string): XBellLocator;
  getByClass(className: string): XBellLocator;
  queryByText(text: string): Promise<XBellElementHandle | null>;
  queryByTestId(testId: string): Promise<XBellElementHandle | null>;
  queryByClass(className: string): Promise<XBellElementHandle | null>;
  url(): Promise<string>;
  waitForNavigation(options?: {
    timeout?: number;
    url?: string|RegExp|((url: URL) => boolean);
    waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
  }): Promise<null | Response>;
  waitForRequest(urlOrPredicate: string| RegExp | ((request: Request) => boolean | Promise<boolean>), options?: {
    timeout?: number;
  }): Promise<Request>;
  waitForResponse(urlOrPredicate: string| RegExp | ((response: Response) => boolean| Promise<boolean>), options?: {
    timeout?: number;
  }): Promise<Response>;
  keyboard: Keyboard;
  mouse: Mouse;
}

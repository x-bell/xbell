import type {
  TimeoutOptions,
  ElementHandleClickOptions,
  ElementHandleDblclickOptions,
  ElementHandleHoverOptions,
  ElementHandleUncheckOptions,
  ElementHandleCheckOptions,
  Rect,
  FrameGotoOptions,
  Response,
  LifecycleEvent,
  PageScreenshotOptions,
  ElementHandleScreenshotOptions,
  Request,
} from './pw';

import type { ElementHandle } from './element-handle';

export interface Locator {
  focus(options?: TimeoutOptions): Promise<void>
  click(options?: ElementHandleClickOptions): Promise<void>;
  dblclick(options?: ElementHandleDblclickOptions): Promise<void>;
  hover(options?: ElementHandleHoverOptions): Promise<void>;
  check(options?: ElementHandleCheckOptions): Promise<void>
  uncheck(options?: ElementHandleUncheckOptions): Promise<void>
  isVisible(options?: TimeoutOptions): Promise<boolean>;
  isChecked(options?: TimeoutOptions): Promise<boolean>;
  isDisabled(options?: TimeoutOptions): Promise<boolean>;
  isHidden(options?: TimeoutOptions): Promise<boolean>;
  boundingBox(options?: TimeoutOptions): Promise<Rect | null>;
  screenshot(options?: ElementHandleScreenshotOptions): Promise<Buffer>
  get(selector: string): Locator;
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getByClass(className: string): Locator;
  queryElementByText(text: string): Promise<ElementHandle | null>;
  queryElementByTestId(testId: string): Promise<ElementHandle | null>;
  queryElementByClass(className: string): Promise<ElementHandle | null>;
  waitFor(options?: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
    timeout?: number;
  }): Promise<void>;
  setInputFiles(files: string | Array<string> | {
    /**
     * File name
     */
    name: string;

    /**
     * File type
     */
    mimeType: string;

    /**
     * File content
     */
    buffer: Buffer;
  } | Array<{
    /**
     * File name
     */
    name: string;

    /**
     * File type
     */
    mimeType: string;
    buffer: Buffer;
  }>, options?: {
    noWaitAfter?: boolean;
    timeout?: number;
  }): Promise<void>;
}

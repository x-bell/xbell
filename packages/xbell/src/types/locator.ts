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
import type { FrameLocator } from './frame-locator';

export interface Locator {
  first(): Locator;
  last(): Locator;
  nth(index: number): Locator;
  count(): Promise<number>;
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
  getFrame(selector: string): FrameLocator;
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getById(id: string): Locator;
  getByClass(className: string): Locator;
  queryElementByText(text: string): Promise<ElementHandle | null>;
  queryElementByTestId(testId: string): Promise<ElementHandle | null>;
  queryElementByClass(className: string): Promise<ElementHandle | null>;
  waitForVisible(options?: TimeoutOptions): Promise<void>;
  waitForHidden(options?: TimeoutOptions): Promise<void>;
  // waitFor(options?: {
  //   state?: 'attached' | 'detached' | 'visible' | 'hidden';
  //   timeout?: number;
  // }): Promise<void>;
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
  fill(value: string, options?: {
    timeout?: number;
  }): Promise<void>;
  textContent(options?: TimeoutOptions): Promise<null | string>;
  queryAttribute(name: string, options?: TimeoutOptions): Promise<null | string>;
  dragTo(target: Locator, options?: {
    sourcePosition?: {
      x: number;

      y: number;
    };
    targetPosition?: {
      x: number;

      y: number;
    };
    timeout?: number;
  }): Promise<void>;
  innerHTML(options?: {
    timeout?: number;
  }): Promise<string>;
  innerText(options?: {
    timeout?: number;
  }): Promise<string>;
  inputValue(options?: {
    timeout?: number;
  }): Promise<string>;
  selectText(options?: {
    timeout?: number;
  }): Promise<void>;
}

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
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getByClass(className: string): Locator;
  queryByText(text: string): Promise<ElementHandle | null>;
  queryByTestId(testId: string): Promise<ElementHandle | null>;
  queryByClass(className: string): Promise<ElementHandle | null>;
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

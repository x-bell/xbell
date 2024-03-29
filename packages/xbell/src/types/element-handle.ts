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

export interface ElementHandle {
  focus(): Promise<void>;
  click(options?: ElementHandleClickOptions): Promise<void>;
  dblclick(options?: ElementHandleDblclickOptions): Promise<void>;
  hover(options?: ElementHandleHoverOptions): Promise<void>;
  check(options?: ElementHandleCheckOptions): Promise<void>;
  uncheck(options?: ElementHandleUncheckOptions): Promise<void>;
  isVisible(): Promise<boolean>;
  isChecked(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isHidden(): Promise<boolean>;
  boundingBox(): Promise<Rect | null>;
  screenshot(options?: ElementHandleScreenshotOptions): Promise<Buffer>;
  queryElementByClass(className: string): Promise<ElementHandle | null>;
  queryElementByTestId(testId: string): Promise<ElementHandle | null>;
  queryElementByText(text: string): Promise<ElementHandle | null>;
}

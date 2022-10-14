import type {
  ElementHandle as PWElementHandle,
} from 'playwright-core';

import type {
  XBellElementHandle,
} from '../types';

import type {
  ElementHandleCheckOptions,
  ElementHandleClickOptions,
  ElementHandleDblclickOptions,
  ElementHandleHoverOptions,
  ElementHandleUncheckOptions,
  Rect,
  ElementHandleScreenshotOptions
} from '../types/pw'

export class ElementHandle implements XBellElementHandle {
  constructor(protected _elementHandle: PWElementHandle<SVGElement | HTMLElement>) {
  }

  focus(): Promise<void> {
    return this._elementHandle.focus();
  }

  hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    return this._elementHandle.hover(options);
  }

  click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    return this._elementHandle.click(options);
  }

  dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    return this._elementHandle.dblclick(options);
  }

  check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    return this._elementHandle.check(options);
  }

  uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    return this._elementHandle.uncheck(options);
  }

  isVisible(): Promise<boolean> {
    return this._elementHandle.isVisible();
  }

  isChecked() {
    return this._elementHandle.isChecked();
  }

  isDisabled(): Promise<boolean> {
    return this._elementHandle.isDisabled();
  }

  isHidden(): Promise<boolean> {
    return this._elementHandle.isHidden();
  }

  boundingBox(): Promise<Rect | null> {
    return this._elementHandle.boundingBox();
  }

  screenshot(options?: ElementHandleScreenshotOptions | undefined): Promise<Buffer> {
    return this._elementHandle.screenshot(options);
  }
}

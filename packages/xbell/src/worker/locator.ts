import type {
  Locator as PWLocator,
  ElementHandle as PWElementHandle,
} from 'playwright-core';

import type {
  XBellLocator,
} from '../types/locator';

import type {
  ElementHandleCheckOptions,
  ElementHandleClickOptions,
  ElementHandleDblclickOptions,
  ElementHandleHoverOptions,
  ElementHandleUncheckOptions,
  Rect,
  TimeoutOptions,
  ElementHandleScreenshotOptions,
} from '../types/pw';
import { ElementHandle } from './element-handle';

function createElementHandle(e: PWElementHandle<SVGElement | HTMLElement> | null) {
  return e ? new ElementHandle(e) : null;
}
export class Locator implements XBellLocator {
  constructor(protected _locator: PWLocator) {}

  isChecked(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isChecked(options)
  }

  isVisible(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isVisible(options)
  }

  isHidden(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isHidden(options)
  }

  isDisabled(options?: TimeoutOptions | undefined): Promise<boolean> {
    return this._locator.isDisabled(options)
  }

  click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    return this._locator.click(options);
  }

  dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    return this._locator.dblclick(options);
  }

  focus(options?: TimeoutOptions | undefined): Promise<void> {
    return this._locator.focus(options);
  }

  check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    return this._locator.check(options);
  }

  uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    return this._locator.check(options);
  }

  hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    return this._locator.hover(options);
  }

  boundingBox(options?: TimeoutOptions | undefined): Promise<Rect | null> {
    return this._locator.boundingBox(options);
  }

  screenshot(options?: ElementHandleScreenshotOptions | undefined): Promise<Buffer> {
    return this._locator.screenshot(options);
  }
  
  getByText(text: string): Locator {
    return new Locator(this._locator.locator(`text=${text}`));
  }

  getByTestId(testId: string): Locator {
    return new Locator(this._locator.locator(`data-testid=${testId}`));
  }

  getByClass(className: string): Locator {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._locator.locator(cls));
  }
  
  async queryByText(text: string): Promise<ElementHandle | null> {
    const handle = await this._locator.elementHandle();
    return createElementHandle(await handle?.$(`text=${text}`) ?? null);
  }

  async queryByTestId(testId: string): Promise<ElementHandle | null> {
    const handle = await this._locator.elementHandle();
    return createElementHandle(await handle?.$(`data-testid=${testId}`) ?? null);
  }

  async queryByClass(className: string): Promise<ElementHandle | null> {
    const handle = await this._locator.elementHandle();
    const cls = className.startsWith('.') ? className : `.${className}`;

    return createElementHandle(await handle?.$(cls) ?? null);
  }

  setInputFiles(files: string | string[] | { name: string; mimeType: string; buffer: Buffer; } | { name: string; mimeType: string; buffer: Buffer; }[], options?: { noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    return this._locator.setInputFiles(files, options);
  }
}

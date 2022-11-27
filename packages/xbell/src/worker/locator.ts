import type {
  Locator as PWLocator,
  FrameLocator as PWFrameLocator,
  ElementHandle as PWElementHandle,
} from 'playwright-core';

import type {
  Locator as LocatorInterface,
  ElementHandle as ElementHandleInterface,
  FrameLocator as FrameLocatorInterface,
} from '../types';

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
import { createElementHandle } from './element-handle';


export class Locator implements LocatorInterface {
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

  fill(value: string, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return this._locator.fill(value, options);
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

  count(): Promise<number> {
    return this._locator.count();
  }

  first(): LocatorInterface {
    return new Locator(this._locator.first());
  }

  last(): LocatorInterface {
    return new Locator(this._locator.last());
  }

  nth(index: number): LocatorInterface {
    return new Locator(this._locator.nth(index));
  }

  get(selector: string): LocatorInterface {
    return new Locator(this._locator.locator(selector));
  }

  getFrame(selector: string): FrameLocator {
    return new FrameLocator(this._locator.frameLocator(selector));
  }
  
  getByText(text: string): LocatorInterface {
    return new Locator(this._locator.locator(`text=${text}`));
  }

  getByTestId(testId: string): LocatorInterface {
    return new Locator(this._locator.locator(`data-testid=${testId}`));
  }

  getByClass(className: string): LocatorInterface {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._locator.locator(cls));
  }
  
  async queryElementByText(text: string): Promise<ElementHandleInterface | null> {
    const handle = await this._locator.elementHandle();
    return createElementHandle(await handle?.$(`text=${text}`) ?? null);
  }

  async queryElementByTestId(testId: string): Promise<ElementHandleInterface | null> {
    const handle = await this._locator.elementHandle();
    return createElementHandle(await handle?.$(`data-testid=${testId}`) ?? null);
  }

  async queryElementByClass(className: string): Promise<ElementHandleInterface | null> {
    const handle = await this._locator.elementHandle();
    const cls = className.startsWith('.') ? className : `.${className}`;

    return createElementHandle(await handle?.$(cls) ?? null);
  }

  setInputFiles(files: string | string[] | { name: string; mimeType: string; buffer: Buffer; } | { name: string; mimeType: string; buffer: Buffer; }[], options?: { noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    return this._locator.setInputFiles(files, options);
  }

  waitForVisible(options?: TimeoutOptions | undefined): Promise<void> {
    return this._locator.waitFor({
      state: 'visible',
      ...options,
    });
  }

  waitForHidden(options?: TimeoutOptions | undefined): Promise<void> {
    return this._locator.waitFor({
      state: 'hidden',
      ...options,
    });
  }

  textContent(options?: TimeoutOptions | undefined): Promise<string | null> {
    return this._locator.textContent(options);
  }

  queryAttribute(name: string, options?: TimeoutOptions | undefined): Promise<string | null> {
    return this._locator.getAttribute(name, options);
  }

  dragTo(target: LocatorInterface, options?: { sourcePosition?: { x: number; y: number; } | undefined; targetPosition?: { x: number; y: number; } | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    // @ts-ignore
    return this._locator.dragTo(target._locator as PWLocator, options);
  }

  innerHTML(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    return this._locator.innerHTML(options);
  }
}

export class FrameLocator implements FrameLocatorInterface {
  constructor(protected _frameLocator: PWFrameLocator) {}

  get(selector: string): LocatorInterface {
    return new Locator(this._frameLocator.locator(selector));
  }

  getFrame(selector: string): FrameLocatorInterface {
    return new FrameLocator(this._frameLocator.frameLocator(selector));
  }

  getByText(text: string): LocatorInterface {
    return new Locator(this._frameLocator.getByText(text));
  }

  getByClass(className: string): LocatorInterface {
    const cls = className.startsWith('.') ? className : `.${className}`;
    return new Locator(this._frameLocator.locator(cls));
  }

  getByTestId(testId: string): LocatorInterface {
    return new Locator(this._frameLocator.getByTestId(testId));
  }

  first(): FrameLocatorInterface {
    return new FrameLocator(this._frameLocator.first());
  }

  nth(index: number): FrameLocatorInterface {
    return new FrameLocator(this._frameLocator.nth(index));
  }

  last(): FrameLocatorInterface {
    return new FrameLocator(this._frameLocator.last());
  }
}

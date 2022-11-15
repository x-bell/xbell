import type { FrameLocator as FrameLocatorInterface,  Locator as LocatorInterface } from '../types'
import type { FrameLocator as PWFrameLocator } from 'playwright-core';
import { Locator } from './locator';

export class FrameLocator implements FrameLocatorInterface {
  constructor(protected _frameLocator: PWFrameLocator) {}

  get(selector: string): LocatorInterface {
    return new Locator(this._frameLocator.locator(selector));
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
}

import type { FrameLocator as FrameLocatorInterface,  Locator as LocatorInterface } from '../types'
import type { FrameLocator as PWFrameLocator } from 'playwright-core';
import type { QueryItem } from './types';

import { Locator } from './locator';

export class FrameLocator implements FrameLocatorInterface {
  private _uuid?: Promise<string>;

  constructor(private queryItems: QueryItem[]) {
  }

  private async _connectToLocator() {
    if (!this._uuid) {
      this._uuid = window.__xbell_page_locator_expose__(this.queryItems).then(res => res.uuid);
    }

    return this._uuid!;
  }

  private async _execute<T extends keyof LocatorInterface>(method: T, ...args: Parameters<LocatorInterface[T]>): Promise<ReturnType<LocatorInterface[T]>> {
    const uuid = await this._connectToLocator();

    return window.__xbell_page_locator_execute__({
      uuid,
      method,
      args,
    });
  }

  private appendQueryItem(type: 'text' | 'class' | 'testId' | null, value: string) {
    return [...this.queryItems, { type: type || undefined, value }];
  }

  get(selector: string): Locator {
    return new Locator(this.appendQueryItem(null, selector));
  }

  getByText(text: string): LocatorInterface {
    return  new Locator(this.appendQueryItem('text', text));
  }

  getByClass(className: string): LocatorInterface {
    return  new Locator(this.appendQueryItem('class', className));
  }

  getByTestId(testId: string): LocatorInterface {
    return  new Locator(this.appendQueryItem('testId', testId));
  }
}

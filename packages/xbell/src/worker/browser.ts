import type { LaunchOptions, Browser, BrowserType } from 'playwright-core';
import { chromium, firefox, webkit } from 'playwright-core';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const BROWSER_MAP: Record<BrowserName, BrowserType> = {
  chromium,
  firefox,
  webkit
}

class LazyBrowser {
  protected _lazy: Record<BrowserName, Promise<Browser> | undefined>

  constructor() {
    this._lazy = {
      chromium: undefined,
      firefox: undefined,
      webkit: undefined,
    };
  }

  newContext(browserType: BrowserName, options?: LaunchOptions) {
    this._lazy[browserType] = BROWSER_MAP[browserType].launch({
      ...options,
    });

    return this._lazy[browserType]!;
  }
}

export const lazyBrowser = new LazyBrowser();

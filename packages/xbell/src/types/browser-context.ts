import type { BrowserContext as PWBrowserContext } from 'playwright-core';

export interface BrowserContext {
  storageState: PWBrowserContext['storageState'];
}

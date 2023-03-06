import type { BrowserContext as PWBrowserContext } from 'playwright-core';

export interface BrowserContext {
  storageState: PWBrowserContext['storageState'];
  cookies: PWBrowserContext['cookies'];
  addCookies: PWBrowserContext['addCookies'];
  clearCookies: PWBrowserContext['clearCookies'];
  close: PWBrowserContext['close'];
}

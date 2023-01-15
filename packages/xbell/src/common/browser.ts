import * as url from 'node:url';
import { chromium, ChromiumBrowser } from 'playwright-core';
import { Page as PageInterface } from '../types';
import { Page } from '../worker/page';

export class Browser {
  static async launch(opts?: {
    headless?: boolean
  }): Promise<Browser> {
    const _browser = await chromium.launch(opts);
    return new Browser(_browser);
  }

  protected constructor(protected _browser: ChromiumBrowser) {}

  async newPage(): Promise<PageInterface> {
    const filename = url.fileURLToPath(import.meta.url);
    const browserContext = await this._browser.newContext();
    return Page.from({
      browserContext: browserContext,
      browserCallbacks: [],
      setupCalbacks: [],
      filename,
      mocks: new Map(),
    });
  }

  async close() {
    await this._browser.close();
  }
}

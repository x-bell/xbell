import type { XBellConfig } from 'xbell';
import viteConfig from './vite.config';

const config: XBellConfig = {
  browser: {
    headless: false,
    devServer: {
      viteConfig,
    }
  },
  hooks: {
    async beforeEach({ page }) {
      await page.goto('https://github.com', {
        mockHTML: '<div id="app"></div>'
      });
    }
  },
}

export default config;

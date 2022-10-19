import type { XBellConfig } from 'xbell';
import viteConfig from './vite.config';

const config: XBellConfig = {
  browser: {
    devServer: {
      viteConfig,
    }
  },
  hooks: {
    async beforeEach({ page }) {
      await page.goto('https://github.com', {
        html: '<div id="app"></div>'
      });
    }
  },
}

export default config;

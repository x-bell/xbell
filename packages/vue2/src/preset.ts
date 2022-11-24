import type { XBellConfig } from 'xbell';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export const preset: XBellConfig = {
  browser: {
    devServer: {
      viteConfig: defineConfig({
        plugins: [vue()],
      }),
    }
  },
  browserTest: {
    html: {
      content: '<div id="app"></div>'
    }
  },
};

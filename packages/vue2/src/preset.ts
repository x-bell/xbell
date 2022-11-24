import type { XBellConfig } from 'xbell';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export const preset: XBellConfig = {
  browser: {
    headless: false,
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
  compiler: {
    jsx: {
      importSource: '@lancercomet/vue2-jsx-runtime',
      runtime: 'automatic',
    }
  },
};

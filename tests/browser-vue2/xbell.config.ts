import type { XBellConfig } from 'xbell';
import { preset } from '@xbell/vue2';
import viteConfig from './vite.config';

const config: XBellConfig = {
  presets: [preset],
  browser: {
    devServer: {
      viteConfig
    }
  },
};

export default config;

import type { XBellConfig } from 'xbell';
import { Vue2Loader } from './loader';

export const preset: XBellConfig = {
  browserTest: {
    html: {
      content: '<div id="app"></div>'
    }
  },
  loaders: [Vue2Loader],
};

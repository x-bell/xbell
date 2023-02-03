import type { XBellConfig } from 'xbell';
import { Vue2Transfomer } from './transfomer';

export const preset: XBellConfig = {
  browserTest: {
    html: {
      content: '<div id="app"></div>'
    }
  },
  transformers: [Vue2Transfomer],
};

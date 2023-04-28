import type { XBellConfig } from 'xbell';
import { USER_AGENT } from './user-agent';

const config: XBellConfig = {
  browser: {
    userAgent: USER_AGENT
  }
};

export default config;

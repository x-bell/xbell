import type { XBellConfig } from 'xbell';

export default {
  runEnvs: ['dev', 'prod'],
  browsers: ['chromium'],
  headless: false,
  envConfig: {
    dev: {
      ENV: 'dev',
      SITE_ORIGIN: 'https://x-bell.github.io/xbell/test-site/dev',
    },
    prod: {
      ENV: 'prod',
      SITE_ORIGIN: 'https://x-bell.github.io/xbell/test-site/prod'
    }
  },
} as XBellConfig;

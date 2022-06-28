import type { XBellConfig } from 'xbell';

export default {
  // runEnvs: ['dev', 'fat', 'prod'],
  runEnvs: ['fat'],
  browsers: ['chromium'],
  headless: false,
  envConfig: {
    dev: {
      ENV: 'dev',
      SITE_ORIGIN: 'https://x-bell.github.io/xbell/test-site/dev'
    },
    fat: {
      ENV: 'fat',
      SITE_ORIGIN: 'https://qyds-fat.gaoding.com'
    },
    prod: {
      ENV: 'prod',
      SITE_ORIGIN: 'https://x-bell.github.io/xbell/test-site/prod'
    }
    
  }
} as XBellConfig;

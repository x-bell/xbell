import { existsSync } from 'node:fs';
import { mergeConfig } from 'vite';
import type { XBellConfig, XBellTaskConfig, XBellBrowserConfig } from '../types'

interface XBellConfigurator {
  globalConfig: XBellConfig;
  queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig>
}

function _mergeConfig (config1: XBellConfig, config2: XBellConfig): XBellConfig {
  return {
    ...config1,
    ...config2,
    browser: {
      ...config1.browser,
      ...config2.browser,
    }
  }
}

export class Configurator implements XBellConfigurator {
  static XBellDefaultBrowserConfig: Required<XBellBrowserConfig> = {
    headless: true,
    viewport: {
      width: 1280,
      height: 500,
    }
  };

  static XBellDefaultConfig: XBellConfig = {
    projects: [
      { name: 'default' }
    ],
    browser: this.XBellDefaultBrowserConfig,
  }

  static XBellConfigFilePaths = [
    'xbell.config.ts',
    'xbell.config.js',
    'xbell.config.mjs',
    'xbell.config.cjs',
  ];

  globalConfig!: XBellConfig;

  async setup() {
    this.globalConfig = await this.loadGlobalConfig()
  }

  protected async loadGlobalConfig() {
    // todo project dir
    const { XBellConfigFilePaths, XBellDefaultConfig } = Configurator;
    const targetConfigFilePath = XBellConfigFilePaths.find((filepath) => existsSync(filepath))
    if (!targetConfigFilePath) {
      return XBellDefaultConfig;
    }
    
    const { default: userConfig } = await import(targetConfigFilePath);
    return mergeConfig(XBellDefaultConfig, userConfig);
  }

  public async queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig> {
    const globalConfig = await this.globalConfig
    return _mergeConfig(globalConfig, caseConfig);
  }
}

export const configurator = new Configurator();

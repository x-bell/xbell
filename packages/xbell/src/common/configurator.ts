import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { mergeConfig } from 'vite';
import type { XBellConfig, XBellTaskConfig, XBellBrowserConfig } from '../types';

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
    },
    devServer: {},
  };

  static XBellDefaultConfig: Required<XBellConfig> = {
    projects: [
      { name: '' }
    ],
    browser: this.XBellDefaultBrowserConfig,
    include: ['**/*.{spec,test}.{cjs,mjs,js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    hooks: {},
  }

  static XBellConfigFilePaths = [
    'xbell.config.ts',
    'xbell.config.js',
    'xbell.config.mjs',
    'xbell.config.cjs',
  ];

  globalConfig!: Required<XBellConfig>;

  async setup() {
    this.globalConfig = await this.loadGlobalConfig()
  }

  protected async loadGlobalConfig(): Promise<Required<XBellConfig>> {
    const projectDir = process.cwd();
    const { XBellConfigFilePaths, XBellDefaultConfig } = Configurator;
    const fullPaths = XBellConfigFilePaths.map(filepath => join(projectDir, filepath))
    const targetConfigFilePath = fullPaths.find((filepath) => existsSync(filepath))
    if (!targetConfigFilePath) {
      return XBellDefaultConfig;
    }
    
    const { default: userConfig } = await import(targetConfigFilePath);
    return mergeConfig(XBellDefaultConfig, userConfig) as Required<XBellConfig>;
  }

  public async queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig> {
    const globalConfig = await this.globalConfig
    return _mergeConfig(globalConfig, caseConfig);
  }
}

export const configurator = new Configurator();

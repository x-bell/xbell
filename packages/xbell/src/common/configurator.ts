import { existsSync } from 'node:fs';
import type { XBellConfig, XBellTaskConfig } from '../types'

interface XBellConfigurator {
  globalConfig: Promise<XBellConfig>;
  queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig>
}

export class Configurator implements XBellConfigurator {
  static XBellDefaultConfig: XBellConfig = {
    headless: true,
    envs: [{ name: 'default' }],
    viewport: {
      width: 1280,
      height: 500,
    },
  }

  static XBellConfigFilePaths = [
    'xbell.config.ts',
    'xbell.config.js',
    'xbell.config.mjs',
    'xbell.config.cjs',
  ];

  globalConfig: Promise<XBellConfig>;

  constructor() {
    this.globalConfig = this.loadGlobalConfig()
  }

  protected async loadGlobalConfig() {
    // todo project dir
    const { XBellConfigFilePaths, XBellDefaultConfig } = Configurator;
    const targetConfigFilePath = XBellConfigFilePaths.find((filepath) => existsSync(filepath))
    if (!targetConfigFilePath) {
      return XBellDefaultConfig;
    }
    
    const { default: config } = await import(targetConfigFilePath)
    return config;
  }

  public async queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig> {
    const globalConfig = await this.globalConfig
    return {
      ...JSON.parse(JSON.stringify(globalConfig)),
      ...caseConfig,
    }
  }
}

export const configurator = new Configurator();

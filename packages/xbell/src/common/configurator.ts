import type { XBellConfig, XBellTaskConfig, XBellBrowserConfig } from '../types';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import debug from 'debug';
import { ProcessEnvKeys } from './env';
import { pathManager } from './path-manager';

const debugConfigurator = debug('xbell:configurator');

interface XBellConfigurator {
  globalConfig: XBellConfig;
  queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig>
}

function _mergeConfigImp (config1: XBellConfig, config2: XBellConfig): XBellConfig {
  return {
    ...config1,
    ...config2,
    browser: {
      ...config1.browser,
      ...config2.browser,
    },
    coverage: {
      ...config1.coverage,
      ...config2.coverage,
    }
  }
}

const mergeConfig = (...configs: XBellConfig[]): XBellConfig => 
  configs
    .slice(1)
    .reduce(
      (acc, config) => _mergeConfigImp(acc, config),
      configs[0]
    );

export class Configurator implements XBellConfigurator {
  static XBellDefaultBrowserConfig: Required<XBellBrowserConfig> = {
    headless: true,
    viewport: {
      width: 1280,
      height: 700,
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
    coverage: {
      enabled: false,
    }
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
    debugConfigurator('globalConfig', this.globalConfig);
  }

  protected async loadGlobalConfig(): Promise<Required<XBellConfig>> {
    const cliConfig = this.getCLIConfig();
    const projectDir = pathManager.projectDir;
    const { XBellConfigFilePaths, XBellDefaultConfig } = Configurator;
    const fullPaths = XBellConfigFilePaths.map(filepath => join(projectDir, filepath))
    const targetConfigFilePath = fullPaths.find((filepath) => existsSync(filepath))
    if (!targetConfigFilePath) {
      return mergeConfig(XBellDefaultConfig, cliConfig) as Required<XBellConfig>;
    }
    
    const { default: userConfig } = await import(targetConfigFilePath);
    return mergeConfig(XBellDefaultConfig, userConfig, cliConfig) as Required<XBellConfig>;
  }

  protected getCLIConfig(): XBellConfig {
    const CLI_COVERAGE = process.env[ProcessEnvKeys.CLICoverage];
    debugConfigurator('cli', CLI_COVERAGE, typeof CLI_COVERAGE);
    const config: XBellConfig = {};

    if (CLI_COVERAGE) {
      config.coverage = { enabled: true };
    }

    return config;
  }

  public async queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig> {
    const globalConfig = await this.globalConfig;
    return mergeConfig(globalConfig, caseConfig);
  }
}

export const configurator = new Configurator();

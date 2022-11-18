import type { XBellConfig, XBellTaskConfig, XBellBrowserConfig, XBellBrowserConfigRequired, XBellConfigRequired } from '../types';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import debug from 'debug';
import { pathManager } from './path-manager';
import { commander } from './commander';
import { cpus } from 'node:os';

const debugConfigurator = debug('xbell:configurator');

interface XBellConfigurator {
  globalConfig: XBellConfig;
  queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig>
}

function _mergeConfigImp(config1: XBellConfig, config2: XBellConfig): XBellConfig {
  const browser1 = config1.browser ?? {};
  const browser2 = config2.browser ?? {};
  return {
    ...config1,
    ...config2,
    browser: {
      ...browser1,
      ...browser2,
      devServer: {
        ...browser1.devServer,
        ...browser2.devServer,
      }
    },
    coverage: {
      ...config1.coverage,
      ...config2.coverage,
    }
  }
}

const mergeConfig = (...configs: Array<XBellConfig>): XBellConfig => 
  (configs)
    .slice(1)
    .reduce(
      (acc, config) => _mergeConfigImp(acc, config),
      configs[0]
    );

export class Configurator implements XBellConfigurator {
  static XBellDefaultBrowserConfig: XBellBrowserConfigRequired = {
    headless: true,
    viewport: {
      width: 1280,
      height: 700,
    },
    devServer: {
      origin: 'https://xbell.test',
      html: {
        content: '<div id="root"></div>'
      }
    },
  };

  static XBellDefaultConfig: XBellConfigRequired = {
    projects: [
      { name: '' }
    ],
    maxThreads: cpus().length,
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

  globalConfig!: XBellConfigRequired;

  async setup() {
    this.globalConfig = await this.loadGlobalConfig()
    debugConfigurator('globalConfig', this.globalConfig);
  }

  protected async loadGlobalConfig(): Promise<XBellConfigRequired> {
    const cliConfig = this.getCLIConfig();
    const projectDir = pathManager.projectDir;
    const { XBellConfigFilePaths, XBellDefaultConfig } = Configurator;
    const fullPaths = XBellConfigFilePaths.map(filepath => path.join(projectDir, filepath))
    const targetConfigFilePath = fullPaths.find((filepath) => existsSync(filepath))
    if (!targetConfigFilePath) {
      return mergeConfig(XBellDefaultConfig, cliConfig) as XBellConfigRequired;
    }
    
    const { default: userConfig } = await import(targetConfigFilePath);
    return mergeConfig(XBellDefaultConfig, userConfig, cliConfig) as XBellConfigRequired;
  }

  protected getCLIConfig(): XBellConfig {
    const hasCLICoverage = commander.getOptions().coverage;

    const config: XBellConfig = {};

    if (hasCLICoverage) {
      config.coverage = { enabled: true };
    }

    return config;
  }
  
  public getProjectConfig({ projectName }: {
    projectName: string
  }): XBellConfigRequired {
    const { projects } = this.globalConfig;
    const project = projects.find(project => project.name === projectName)
    if (project?.config) {
      return mergeConfig(this.globalConfig, project.config) as XBellConfigRequired;
    }
    return this.globalConfig;
  }

  public async queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig> {
    const globalConfig = this.globalConfig;
    return mergeConfig(globalConfig, caseConfig);
  }

  public async runConfigSetup(setup: XBellConfig['setup']) {
    if (typeof setup === 'function') {
      await this.runSetupCallback(setup);
    } else if (typeof setup === 'string') {
      await this.runSetupFiles([setup]);
    } else if (Array.isArray(setup)) {
      await this.runSetupFiles(setup);
    }
  }

  protected async runSetupFiles(files: string[]) {
    for (const file of files) {
      const fullpath = file.startsWith('.') ? path.join(pathManager.projectDir, file) : file;
      await import(fullpath)
    }
  }

  protected async runSetupCallback(callback: Function) {
    await callback();
  }
}

export const configurator = new Configurator();

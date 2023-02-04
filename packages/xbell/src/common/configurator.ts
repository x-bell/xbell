import type { XBellConfig, XBellTaskConfig, XBellBrowserConfigRequired, XBellConfigRequired } from '../types';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import { cpus } from 'node:os';
import debug from 'debug';
import { pathManager } from './path-manager';
import { commander } from './commander';

const debugConfigurator = debug('xbell:configurator');

interface XBellConfigurator {
  globalConfig: XBellConfig;
  queryCaseConfig(caseConfig: XBellTaskConfig): Promise<XBellConfig>
}

async function _mergeConfigImp(config1: XBellConfig, config2: XBellConfig): Promise<XBellConfig> {
  const browser1 = config1.browser ?? {};
  const browser2 = config2.browser ?? {};
  const compiler1 = config1.compiler ?? {};
  const compiler2 = config2.compiler ?? {};
  return {
    ...config1,
    ...config2,
    browser: {
      ...browser1,
      ...browser2,
    },
    coverage: {
      ...config1.coverage,
      ...config2.coverage,
    },
    compiler: {
      ...compiler1,
      ...compiler2,
      jsx: {
        ...compiler1.jsx,
        ...compiler2.jsx,
      }
    },
    loaders: [
      ...(config1.loaders ?? []),
      ...(config2.loaders ?? []),
    ]
  }
}

const mergeConfig = async (...configs: Array<XBellConfig>): Promise<XBellConfig> => {
  const [config, ...rest] = configs;
  let ret = config;
  for (let i = 0; i < rest.length; i++) {
    ret = await _mergeConfigImp(ret, rest[i]);
  }
  return ret;
}
export class Configurator implements XBellConfigurator {
  static XBellDefaultBrowserConfig: XBellBrowserConfigRequired = {
    headless: true,
    devtools: false,
    viewport: {
      width: 1280,
      height: 700,
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
    compiler: {
      jsx: {
        pragma: 'React.createElement',
        pragmaFrag: 'React.Fragment',
        runtime: 'classic',
        importSource: 'react',
      },
    },
    hooks: {},
    coverage: {
      enabled: false,
    },
    browserTest: {
      url: 'https://xbell.test',
      html: {
        content: '<div id="root"></div>'
      },
    },
    loaders: [],
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
      return await mergeConfig(XBellDefaultConfig, cliConfig) as XBellConfigRequired;
    }
    
    const { default: userConfig } = (await import(targetConfigFilePath)) as { default: XBellConfig | null | undefined };

    if (!userConfig) {
      throw `The configuration file "${targetConfigFilePath}" does not export default.`
    }
    const { presets: userConfigPresets } = userConfig;
    const presets = (() => {
      if (!userConfigPresets) return [];
      if (Array.isArray(userConfigPresets)) return userConfigPresets;
      return [userConfigPresets];
    })();

    const configByPresets = await mergeConfig(XBellDefaultConfig, ...presets);
    // presets.reduce<XBellConfigRequired>((acc, preset) => mergeConfig(acc, preset) as XBellConfigRequired, XBellDefaultConfig);

    return await mergeConfig(configByPresets, userConfig, cliConfig) as XBellConfigRequired;
  }

  protected getCLIConfig(): XBellConfig {
    const hasCLICoverage = commander.getOptions().coverage;

    const config: XBellConfig = {};

    if (hasCLICoverage) {
      config.coverage = { enabled: true };
    }

    return config;
  }
  
  public async getProjectConfig({ projectName }: {
    projectName: string
  }): Promise<XBellConfigRequired> {
    const { projects } = this.globalConfig;
    const project = projects.find(project => project.name === projectName)
    if (project?.config) {
      return await mergeConfig(this.globalConfig, project.config) as XBellConfigRequired;
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

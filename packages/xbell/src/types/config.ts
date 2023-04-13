import type { UserConfigExport } from 'vite';
import type { XBellNodeJSTestCaseFunction } from './test';
import type { StorageState } from './pw';
export type XBellBrowserType = 'chromium' | 'firefox' | 'webkit';

export interface XBellBrowserDevServerConfig {
  viteConfig?: UserConfigExport;
}
export interface XBellBrowserConfig {
  headless?: boolean;
  devtools?: boolean;
  /** browser viewport */
  viewport?: {
    width: number;
    height: number;
  };
  // cookies & origins(localStorage)
  storageState?: StorageState | string;
  /** browser dev server */
  devServer?: XBellBrowserDevServerConfig;
}

export interface XBellConfig {
  debug?: boolean;
  /** setup */
  setup?: string[] | string | (() => Promise<void> | void);
  /** teardown */
  teardown?: string[] | string | (() => Promise<void> | void);
  /** compiler */
  compiler?: {
    jsx?: {
      pragmaFrag?: string;
      pragma?: string;
      runtime?: 'classic' | 'automatic';
      importSource?: string;
    }
  };
  presets?: XBellConfig[] | XBellConfig;
  /** browser config */
  browser?: XBellBrowserConfig;
  /** projects */
  projects?: XBellProject[];
  /** include */
  include?: string[];
  /** exclude */
  exclude?: string[];

  maxThreads?: number;

  hooks?: {
    beforeEach?: XBellNodeJSTestCaseFunction;
    afterEach?: XBellNodeJSTestCaseFunction;
  }

  coverage?: {
    enabled?: boolean;
    include?: string[];
    exclude?: string[];
  }

  browserTest?: {
    url?: string;
    html?: {
      path?: string;
      content?: string;
    }
  };
}

type XBellConfigOptionalsKeys = 'setup' | 'teardown' | 'browser' | 'presets';
type XBellBrowserConfigOptionalsKeys = 'storageState';

type XBellBrowserDevServerConfigOptionalsKeys = 'viteConfig';

export type XBellBrowserDevServerConfigRequired = Required<Omit<XBellBrowserDevServerConfig, XBellBrowserDevServerConfigOptionalsKeys>> &
  Partial<Pick<XBellBrowserDevServerConfig, XBellBrowserDevServerConfigOptionalsKeys>>;

export type XBellBrowserConfigRequired =
  Required<Omit<XBellBrowserConfig, XBellBrowserConfigOptionalsKeys>> &
  Partial<Pick<XBellBrowserConfig, XBellBrowserConfigOptionalsKeys>> & {
    devServer: XBellBrowserDevServerConfigRequired;
  }
  
export type XBellConfigRequired =
  Required<Omit<XBellConfig, XBellConfigOptionalsKeys>> &
  Partial<Pick<XBellConfig, XBellConfigOptionalsKeys>> & {
    browser: XBellBrowserConfigRequired;
  };

export type XBellTaskConfig = Partial<
  Pick<
    XBellConfig, 'browser'
  >
>;

export type XBellProject = {
  name: XBellProjects['name'];
  config?: XBellConfig;
} & Omit<XBellProjects, 'name'>;

export interface XBellBrowserCallback {
  callback: (...args: any) => any;
  filename: string;
  sortValue: number; // no used
}

export interface XBellNodeJSCallback {
  callback: (...args: any) => any;
  filename: string;
  sortValue: number; // no used
}

export interface XBellCommonCallback {
  callback: (...args: any) => any;
  filename: string;
  sortValue: number; // no used
}


export type XBellRuntimeOptions = Partial<{
  browserCallbacks: XBellBrowserCallback[];
  nodejsCallbacks: XBellNodeJSCallback[];
  commonCallbacks: XBellCommonCallback[];
  args?: object
}>;

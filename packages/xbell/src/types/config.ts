import { XBellProject } from './project';

export type XBellBrowserType = 'chromium' | 'firefox' | 'webkit';

export interface XBellBrowserConfig {
  headless?: boolean;
  /** browser viewport */
  viewport?: {
    width: number;
    height: number;
  }
}

export interface XBellConfig {
  /** browser config */
  browser?: XBellBrowserConfig;
  /** browser headless mode */
  retries?: number;
  /** threads */
  threads?: boolean | number;
  /** test root dir */
  testDir?: string;
  /** projects */
  projects?: XBellProject[];
}

export type XBellTaskConfig = Partial<
  Pick<
    XBellConfig, 'browser' | 'retries'
  >
>;

export type XBellRuntimeOptions = Partial<{
  browserCallbacks: Array<(...args: any) => any>;
  args?: object
}>;


export type MultiEnvData<T> = Partial<Record<XBellEnv['name'], T>>;

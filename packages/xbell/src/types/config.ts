export type XBellBrowserType = 'chromium' | 'firefox' | 'webkit';

export interface XBellConfig {
  /** envs */
  envs: XBellEnv[];
  /** browser type */
  browsers?: XBellBrowserType[];
  /** browser headless mode */
  headless?: boolean;
  /** browser viewport */
  viewport: {
    width: number;
    height: number;
  }
  retries?: number;
  /**
   * threads
   */
  threads?: boolean | number;
  /** test root dir */
  testDir?: string;
};

export type XBellTaskConfig = Partial<
  Pick<
    XBellConfig,
    | 'browsers'
    | 'headless'
    | 'retries'
    | 'viewport'
  >
>;

export type XBellRuntimeOptions = Partial<{
  browserCallbacks: Array<(...args: any) => any>;
  args?: object
}>;


export type MultiEnvData<T> = Partial<Record<XBellEnv['name'], T>>;

export type XBellBrowserType = 'chromium' | 'firefox' | 'webkit';

export interface XBellBrowserConfig {
  headless?: boolean;
  /** browser viewport */
  viewport?: {
    width: number;
    height: number;
  },
}

export interface XBellConfig {
  /** browser config */
  browser?: XBellBrowserConfig;
  /** projects */
  projects?: XBellProject[];
  /** include */
  include?: string[];
  /** exclude */
  exclude?: string[];
}

export type XBellTaskConfig = Partial<
  Pick<
    XBellConfig, 'browser'
  >
>;

export type XBellProject = {
  name: XBellProjects['names'];
  config?: XBellConfig;
} & Omit<XBellProjects, 'names'>;


export type XBellRuntimeOptions = Partial<{
  browserCallbacks: Array<(...args: any) => any>;
  args?: object
}>;

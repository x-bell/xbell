
export type XBellBrowserType = 'chromium' | 'firefox' | 'webkit';

export type XBellConfig = {
  /** 运行的环境 */
  runEnvs: EnvConfig['ENV'][];
  /** 浏览器类型 */
  browsers?: XBellBrowserType[];
  /** 是否无头模式 */
  headless?: boolean;
  /** 环境变量配置 */
  envConfig: Partial<Record<EnvConfig['ENV'], EnvConfig>>;
  /** viewport 大小 */
  viewport: {
    width: number;
    height: number;
  }
};

export type MultiEnvData<T> = Partial<Record<EnvConfig['ENV'], T>>;
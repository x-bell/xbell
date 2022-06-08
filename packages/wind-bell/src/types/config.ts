import { BrowserType } from 'playwright-core'
// import { EnvConfig } from '../env';

export type BellBrowserType = 'chromium' | 'firefox' | 'webkit';

export type WindBellConfig = {
  runEnvs: EnvConfig['ENV'][]
  browsers?: BellBrowserType[]
  headless?: boolean
  envConfig: Partial<Record<EnvConfig['ENV'], EnvConfig>>
};

export type MultiEnvData<T> = Partial<Record<EnvConfig['ENV'], T>>;
import { ProcessEnvKeys } from '../constants/env';

interface CrossEnvData {
  jsxPragmaFrag: string;
  jsxPragma: string;
}

const ENV_MAP = {
  jsxPragmaFrag: ProcessEnvKeys.JSX_PRAGMA_FRAG,
  jsxPragma: ProcessEnvKeys.JSX_PRAGMA,
} as const;

class CrossEnv {
  data: CrossEnvData = {
    jsxPragma: 'React.createElement',
    jsxPragmaFrag: 'React.Fragment'
  };

  set(key: keyof CrossEnvData, value: string) {
    process.env[ENV_MAP[key]] = value;
  }

  get(key: keyof CrossEnvData): string {
    return process.env[ENV_MAP[key]] as string;
  }
}

export const crossEnv = new CrossEnv();

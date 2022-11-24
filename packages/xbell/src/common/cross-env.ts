import { ProcessEnvKeys } from '../constants/env';

interface CrossEnvData {
  jsxPragmaFrag: string;
  jsxPragma: string;
  jsxImportSource: string;
  jsxRuntime: 'classic' | 'automatic';
}

const ENV_MAP = {
  jsxPragmaFrag: ProcessEnvKeys.JSX_PRAGMA_FRAG,
  jsxPragma: ProcessEnvKeys.JSX_PRAGMA,
  jsxImportSource: ProcessEnvKeys.JSX_IMPORT_SOURCE,
  jsxRuntime: ProcessEnvKeys.JSX_RUNTIME,
} as const;

class CrossEnv {
  data: CrossEnvData = {
    jsxPragma: 'React.createElement',
    jsxPragmaFrag: 'React.Fragment',
    jsxImportSource: 'react',
    jsxRuntime: 'classic',
  };

  set(key: keyof CrossEnvData, value: string) {
    process.env[ENV_MAP[key]] = value;
  }

  get<T extends keyof CrossEnvData>(key: T): CrossEnvData[T] {
    return process.env[ENV_MAP[key]] as CrossEnvData[T] || this.data[key];
  }
}

export const crossEnv = new CrossEnv();

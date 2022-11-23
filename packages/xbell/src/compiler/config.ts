import type { TsParserConfig, JscConfig } from '@swc/core';
import { crossEnv } from '../common/cross-env';

export const tsParserConfig: TsParserConfig = {
  syntax: 'typescript',
  decorators: true,
  tsx: true,
};

export function getJSCConfig(): JscConfig {
  return {
    parser: tsParserConfig,
    transform: {
      decoratorMetadata: true,
      legacyDecorator: true,
      react: {
        runtime: 'classic',
        pragma: crossEnv.get('jsxPragma'),
        pragmaFrag: crossEnv.get('jsxPragmaFrag'),
      }
    },
    target: 'es2020',
  }
}

import type { TsParserConfig, JscConfig } from '@swc/core';
import { crossEnv } from '../common/cross-env';
import debug from 'debug';
import { XBELL_JSX_PRAGMA, XBELL_JSX_PRAGMA_FRAG } from '../constants/xbell';
const debugJSC = debug('xbell:jsc');
export const tsParserConfig: TsParserConfig = {
  syntax: 'typescript',
  decorators: true,
  tsx: true,
};

export function getJSCConfig(): JscConfig {
  const ret: JscConfig = {
    parser: tsParserConfig,
    transform: {
      decoratorMetadata: true,
      legacyDecorator: true,
      react: {
        runtime: 'classic',
        pragma: XBELL_JSX_PRAGMA,
        pragmaFrag: XBELL_JSX_PRAGMA_FRAG,
      }
    },
    target: 'es2020',
  };
  debugJSC('ret', ret);
  return ret;
}

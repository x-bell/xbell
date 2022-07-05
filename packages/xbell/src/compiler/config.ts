import type { TsParserConfig, JscConfig } from '@swc/core';

export const tsParserConfig: TsParserConfig = {
  syntax: 'typescript',
  decorators: true,
  tsx: true,
};

export const jscConfig: JscConfig = {
  parser: tsParserConfig,
  target: 'es2017',
};

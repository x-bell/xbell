import { addHook } from 'pirates';
import { transformSync } from '@swc/core';
import { tsParserConfig } from './config';
import { transformJSX } from './jsx';

export function registerTransfomer() {
  const revert = addHook(
    (sourceCode, filename) => {
      return transformJSX(sourceCode).code;
    },
    { exts: ['.jsx', '.tsx'] }
  );
  return revert;
}
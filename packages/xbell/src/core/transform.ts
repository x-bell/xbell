import { addHook } from 'pirates';
import { transformSync } from '@swc/core';

export function registerTransfomer() {
  const revert = addHook(
    (sourceCode, filename) => {
      const { code, map } = transformSync(sourceCode, {
        module: {
          type: 'commonjs'
        },
        jsc: {
          target: 'es5',
          parser: {
            syntax: 'typescript',
            decorators: true,
            tsx: true,
          }
        },
      })!;
      return code!;
    },
    { exts: ['.js', '.ts', '.jsx', '.tsx'] }
  );
  return revert;
}
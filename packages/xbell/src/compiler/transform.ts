import { addHook } from 'pirates';
import { transformSync } from '@swc/core';
import { jscConfig } from './config';
import { transformJSX } from './jsx';

export function registerTransfomer() {
  const revertJsx = addHook(
    (sourceCode, filename) => {
      return transformJSX(sourceCode, filename).code;
    },
    { exts: ['.jsx', '.tsx'] }
  );

  const revertTs = addHook((sourceCode, filename) => {
    const { code, map } = transformSync(sourceCode, {
      module: {
        type: 'commonjs'
      },
      jsc: jscConfig,
    });
    return code;
  }, {
    exts: ['.ts']
  })
  return [
    revertJsx,
    revertTs
  ];
}
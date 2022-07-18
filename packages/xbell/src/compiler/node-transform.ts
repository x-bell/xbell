import { transformSync } from '@swc/core';
import { jscConfig } from './config';
export async function transformNodeCode(
  sourceCode: string,
) {
  const { code } = transformSync(sourceCode, {
    module: {
      type: 'nodenext'
    },
    jsc: {
      ...jscConfig,
    },
  });
  return code;
}

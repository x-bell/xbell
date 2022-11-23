import { transformSync } from '@swc/core';
import { getJSCConfig } from './config';

export async function transformNodeCode(
  sourceCode: string,
) {
  const { code } = transformSync(sourceCode, {
    module: {
      type: 'nodenext'
    },
    sourceMaps: 'inline',
    jsc: getJSCConfig(),
  });
  return code;
}

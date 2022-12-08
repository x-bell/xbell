import { test } from 'xbell';
import { createRequire } from 'node:module';
import { resolve } from '../src/resolve';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(new URL(import.meta.url));
const require = createRequire(import.meta.url);

test('#resolve', async ({ expect }) => {
  const { filename } = resolve({
    importer: __filename,
    specifier: '@swc/core'
  });

  const retByNative = require.resolve('@swc/core');
  console.log('ret', filename, retByNative);
});

import { test } from 'xbell';
import * as path from 'node:path';
import { createRequire } from 'node:module';
import { resolve } from '../src/resolve';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);


const mainTSFilename = path.join(
  __dirname,
  './fixtures/src/main.ts'
);

const require = createRequire(import.meta.url);

test('#resolve - pkg', async ({ expect }) => {
  const { filename } = resolve({
    importer: __filename,
    specifier: '@swc/core'
  });

  const retByNative = require.resolve('@swc/core');
  console.log('ret', filename, retByNative);
});

test('#resolve - file', ({ expect }) => {
  console.log('mainTSFilename', mainTSFilename);
  const { filename } = resolve({
    importer: mainTSFilename,
    specifier: './add',
  });
  const relativeFilename = path.relative(__dirname, filename);
  expect(relativeFilename).toBe('fixtures/src/add.ts');
});

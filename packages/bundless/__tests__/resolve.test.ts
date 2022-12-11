import type { FileInfo } from '../src/types';
import * as path from 'node:path';
import { createRequire } from 'node:module';
import { test } from 'xbell';
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
  const ret = await resolve({
    importer: __filename,
    specifier: '@swc/core'
  });

  const retByNative = require.resolve('@swc/core');
  console.log('ret', retByNative, ret);
  expect(ret.type).toBe('package');
});

test('#resolve - file', async ({ expect }) => {
  console.log('mainTSFilename', mainTSFilename);
  const ret = await resolve({
    importer: mainTSFilename,
    specifier: './add',
  });
  expect(ret.type).toBe('file');
  const relativeFilename = path.relative(__dirname, (ret as FileInfo).filename);
  expect(relativeFilename).toBe('fixtures/src/add.ts');
});

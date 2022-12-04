import { test } from 'xbell';
import { createRequire } from 'node:module';
import { resolve } from '../src/resolve';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(new URL(import.meta.url));
const require = createRequire(import.meta.url);

test('#resolve', async ({ expect }) => {
  const a = require.resolve('url')
  // const c = require.resolve('xbell')
  const swc = require.resolve('@swc/core')
  // const xbellEntry = await resolve('xbell', __filename);
  console.log('xbellEntry', a, swc);
  console.log('import.meta.url', import.meta.url, __filename);
});

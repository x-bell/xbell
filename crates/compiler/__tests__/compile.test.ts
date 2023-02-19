import { test } from 'xbell';
import { compile } from '../index';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as path from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

test('compile', () => {
  const cjsPath = path.join(__dirname, '../fixtures/condition-require.js');
  const sourceCode = fs.readFileSync(cjsPath, 'utf-8');
  const ret = compile(sourceCode, cjsPath);

  console.log('ret', ret);
});

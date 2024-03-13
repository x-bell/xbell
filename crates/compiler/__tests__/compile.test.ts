import { test } from 'xbell';
import { compile } from '../index';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as path from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const compileOptions = {
  extensions: [".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"],
  conditions: ["import",],
  cwd: __dirname,
}

// test('compile', () => {
  const cjsPath = path.join(__dirname, 'fixtures/condition-require.js');
  const sourceCode = fs.readFileSync(cjsPath, 'utf-8');
  const ret = compile(sourceCode, cjsPath, {
    ...compileOptions,
    isCallbackFunction: false,
  });

  console.log('ret', ret);
// });


(() => {
  const cjsPath = path.join(__dirname, 'fixtures/react-ts/main.tsx');
  const sourceCode = fs.readFileSync(cjsPath, 'utf-8');
  const ret = compile(sourceCode, cjsPath, {
    ...compileOptions,
    isCallbackFunction: false,
  });

  console.log('ret', ret);
})()

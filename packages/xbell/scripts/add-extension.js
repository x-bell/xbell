import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { } from 'fs-extra';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

import glob from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '../dist');
const files = glob.sync('**/*.js', {
  cwd: distPath
});

files.forEach((name) => {
  const filename = join(distPath, name);
  const code = readFileSync(filename, 'utf-8');
  const finalCode = code.replace(/from\s[\'\"](\..+?)[\'\"]/g, (str, importPath) => {
    const jsFilePath = join(dirname(filename), importPath + '.js')
    const isExists = existsSync(jsFilePath)
    if (isExists) {
      const ret = str.replace(importPath, importPath + '.js');
      return ret;
    }
    return str;
  });

  writeFileSync(filename, finalCode, 'utf-8');
})

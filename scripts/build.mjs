import { readFileSync, existsSync, writeFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import glob from 'fast-glob';

const fixExt = () => {
  const distPath = join(process.cwd(), './dist');
  const files = glob.sync('**/*.js', {
    cwd: distPath,
  });
  files.forEach((name) => {
    const filename = join(distPath, name);
    const code = readFileSync(filename, 'utf-8');
    const finalCode = code.replace(/from\s[\'\"](\..+?)[\'\"]/g, (str, importPath) => {
      const jsFilePath = join(dirname(filename), importPath + '.js')
      const isExists = existsSync(jsFilePath)
      if (isExists) {
        const ret = str.replace(importPath, importPath + '.mjs');
        return ret;
      }
      return str;
    });

    writeFileSync(filename, finalCode, 'utf-8');
  });


  files.forEach((name) => {
    const filename = join(distPath, name);
    renameSync(filename, filename.replace(/\.js$/, '.mjs'))
  });
}

fixExt();

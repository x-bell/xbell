import glob from 'fast-glob';
import { join } from 'node:path';

const files = glob.sync('**/*.{spec,test}.{cjs,mjs,js,jsx,ts,tsx}', {
  ignore: 'node_modules',
  cwd: process.cwd(),
});

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const filepath = join(process.cwd(), file);
  await import(filepath);
}

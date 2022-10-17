import { writePackageJson } from './utils/write-package-json';
import { writeTSConfig } from './utils/write-ts-config';
import { writeDefaultXBellConfig } from './utils/write-default-xbell-config';
import color from '@xbell/color';

export async function initXBell() {
  const projectDir = process.cwd();
  await writePackageJson(projectDir);
  await writeDefaultXBellConfig(projectDir);
  await writeTSConfig(projectDir);
  console.log(color.green('Done! run:'))
  console.log()
  console.log('  ' + color.cyan('npm install'))
  console.log()
  console.log('  ' + color.cyan('npm run install-browser'))
  console.log()
  console.log('  ' + color.cyan('npm run test'))
}

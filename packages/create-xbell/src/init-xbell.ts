import * as chalk from 'chalk';
import { writePackageJson } from './utils/write-package-json';
import { writeTSConfig } from './utils/write-ts-config';
import { writeDefaultXBellConfig } from './utils/write-default-xbell-config';

export function initXBell() {
  const projectDir = process.cwd();
  writePackageJson(projectDir);
  writeDefaultXBellConfig(projectDir);
  writeTSConfig(projectDir);
  console.log(chalk.green('Done! run:'))
  console.log()
  console.log('  ' + chalk.cyan('npm install'))
  console.log()
  console.log('  ' + chalk.cyan('npm run install-browser'))
  console.log()
  console.log('  ' + chalk.cyan('npm run test'))
}

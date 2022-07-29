import * as chalk from 'chalk';
import { modifyPackageJson } from './utils/modify-package-json';
import { modifyTSConfig } from './utils/modify-ts-config';
import { writeDefaultXBellConfig } from './utils/write-default-xbell-config';

export function initExistedProject() {
  const projectDir = process.cwd();
  writeDefaultXBellConfig(projectDir);
  modifyPackageJson(projectDir);
  modifyTSConfig(projectDir);
  console.log(chalk.green('Done! run:'))
  console.log()
  console.log('  ' + chalk.cyan('npm install'))
  console.log()
  console.log('  ' + chalk.cyan('npm run install-browser'))
  console.log()
  console.log('  ' + chalk.cyan('npm run test'))
}
import { modifyPackageJson } from './utils/modify-package-json';
import { modifyTSConfig } from './utils/modify-ts-config';
import { writeDefaultXBellConfig } from './utils/write-default-xbell-config';

export function initExistedProject() {
  const projectDir = process.cwd();
  writeDefaultXBellConfig(projectDir);
  modifyPackageJson(projectDir);
  modifyTSConfig(projectDir);
}
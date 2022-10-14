import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { getJsonFileSpaces } from './get-json-file-spaces';

const XBELL_VERSION = '^0.4.2';

const SCRIPTS = {
  'test': 'xbell',
  'install-browser': 'xbell install browser',
} as const

export function modifyPackageJson(projectDir: string) {
  const pkgJsonPath = join(projectDir, 'package.json')
  const pkgJson = require(pkgJsonPath);

  pkgJson.devDependencies = pkgJson.devDependencies || {}
  pkgJson.devDependencies.xbell = pkgJson.devDependencies.xbell || XBELL_VERSION;

  pkgJson.scripts = pkgJson.scripts || {};

  
  for (const [key, value] of Object.entries(SCRIPTS)) {
    pkgJson.scripts[key] = value;
  }

  const spaces = getJsonFileSpaces(pkgJsonPath);
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, spaces));
}

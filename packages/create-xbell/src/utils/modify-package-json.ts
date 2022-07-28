import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { getJsonFileSpaces } from './get-json-file-spaces';

const xbellTsConfigJson = {
  "test:xbell": "xbell",
}

// function writeXBellTsConfigJson(rootDir: string) {
//   const xbellTsJsonPath = join(rootDir, 'tsconfig.xbell.json')
//   writeFileSync(
//     xbellTsJsonPath,
//     JSON.stringify(xbellTsConfigJson),
//     'utf-8'
//   )
// }

const SCRIPT_KEYS = [
  'test',
  'xbell-test'
];

const XBELL_SCRIPT = 'xbell';

export function modifyPackageJson(projectDir: string) {
  const pkgJsonPath = join(projectDir, 'package.json')
  const pkgJson = require(pkgJsonPath);
  pkgJson.scripts = pkgJson.scripts || {};
  const isExistedXBellTestKey = SCRIPT_KEYS.some(
    key =>
      typeof pkgJson.scripts[key] === 'string' && (
        pkgJson.scripts[key].includes('xbell') || key.includes('xbell')
      )
  );

  if (isExistedXBellTestKey) {
    return;
  }

  for (const key of SCRIPT_KEYS) {
    if (!pkgJson.scripts[key]) {
      const spaces = getJsonFileSpaces(pkgJsonPath);
      pkgJson.scripts[key] = XBELL_SCRIPT;
      writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, spaces))
      return;
    }
  }
}

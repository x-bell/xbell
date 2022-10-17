import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { getJsonFileSpaces, loadJSON } from './json';

export function existPackageJson(rootDir: string) {
  const hasPkgJson = existsSync(
    join(rootDir, 'package.json')
  )
  return hasPkgJson;
}

export const DEFAULT_PACKAGE_JSON = {
  name: '',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  scripts: {},
  keywords: [],
  author: '',
};

const XBELL_VERSION = 'latest';

const SCRIPTS = {
  'test': 'xbell',
  'install-browser': 'xbell install browser',
} as const

export function writePackageJson(projectDir: string) {
  const isExistedPackageJson = existPackageJson(projectDir);
  const pkgJsonPath = join(projectDir, 'package.json');
  const pkgJson = isExistedPackageJson ? loadJSON(pkgJsonPath) : JSON.parse(
    JSON.stringify(DEFAULT_PACKAGE_JSON)
  );

  pkgJson.devDependencies = pkgJson.devDependencies || {}
  const dependencies = pkgJson.dependencies || {};
  pkgJson.devDependencies.xbell = pkgJson.devDependencies.xbell || dependencies.xbell || XBELL_VERSION;

  pkgJson.scripts = pkgJson.scripts || {};

  
  for (const [key, value] of Object.entries(SCRIPTS)) {
    pkgJson.scripts[key] = value;
  }

  const spaces = isExistedPackageJson ? getJsonFileSpaces(pkgJsonPath) : 2;
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, spaces) + '\n');
}

import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { getJsonFileSpaces } from './get-json-file-spaces';

const xbellTsConfigJson = {
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "lib": [ "es2015", "DOM"]
  },
  "include": [
    "xbell-env.d.ts",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.ts",
    "**/*.tsx"
  ]
}

function writeXBellTsConfigJson(rootDir: string, spaces = 2) {
  const xbellTsJsonPath = join(rootDir, 'tsconfig.test.json');
  writeFileSync(
    xbellTsJsonPath,
    JSON.stringify(xbellTsConfigJson, null, spaces),
    'utf-8'
  )
}

// const xbellEnvDTS = `export interface EnvConfig {
//   ENV: 'dev' | 'prod'
// }

// `

// function writeXBellEnvConfig(rootDir: string) {
//   const xbellTsJsonPath = join(rootDir, 'xbell-env.d.ts')
//   writeFileSync(
//     xbellTsJsonPath,
//     xbellEnvDTS,
//     'utf-8'
//   )
// }

export function writeTSConfig(rootDir: string) {
  const tsJsonPath = join(rootDir, 'tsconfig.json');
  const tsTestJsonPath = join(rootDir, 'tsconfig.test.json');
  const isExistedTsJson = existsSync(tsJsonPath);
  const isExistedTsTestJson = existsSync(tsTestJsonPath);
  if (!isExistedTsJson) {

  }
  if (!isExistedTsTestJson) {

  }
  const tsJson = isExistedTsJson ? require(tsJsonPath) : {}
  const spaces = isExistedTsJson ? getJsonFileSpaces(tsJsonPath) : 2;
  tsJson.references = [
    ...(tsJson.references || []),
    { path: './tsconfig.test.json' }
  ];

  // write rederences
  writeFileSync(
    tsJsonPath,
    JSON.stringify(tsJson, null, spaces),
    'utf-8'
  )
  writeXBellTsConfigJson(rootDir, spaces)
}


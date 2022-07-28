import { join } from 'path';
import { existsSync, writeFileSync } from 'fs';

const xbellTsConfigJson = {
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  },
  "include": [
    "xbell-env.d.ts",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx"
  ]
}

function writeXBellTsConfigJson(rootDir: string) {
  const xbellTsJsonPath = join(rootDir, 'tsconfig.xbell.json')
  writeFileSync(
    xbellTsJsonPath,
    JSON.stringify(xbellTsConfigJson),
    'utf-8'
  )
}

export function modifyTSConfig(rootDir: string) {
  const tsJsonPath = join(rootDir, 'tsconfig.json')
  const isExistedTsJson = existsSync(tsJsonPath);
  const tsJson = isExistedTsJson ? require(tsJsonPath) : {}
  tsJson.references = [
    ...(tsJson.references || []),
    { path: './tsconfig.xbell.json' }
  ];
  writeFileSync(
    tsJsonPath,
    JSON.stringify(tsJson),
    'utf-8'
  )
  writeXBellTsConfigJson(rootDir)
}

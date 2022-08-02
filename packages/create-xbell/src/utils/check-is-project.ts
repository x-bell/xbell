import { existsSync } from 'fs';
import { join } from 'path';

export function checkIsProject(rootDir: string) {
  const hasPkgJson = existsSync(
    join(rootDir, 'package.json')
  )
  return hasPkgJson;
}

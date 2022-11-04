import * as path from 'path';
import { pathManager } from '../common/path-manager';

export function getBrowserCaseDirPath(filename: string) {
  const relativePath = path.dirname(path.relative(cwd, filename));
  return path.join(pathManager.projectDir, '.xbell/unit', relativePath);
}

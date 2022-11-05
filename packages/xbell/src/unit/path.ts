import * as path from 'path';
import { pathManager } from '../common/path-manager';

export function getBrowserCaseDirPath(filename: string) {
  const relativePath = path.dirname(path.relative(pathManager.projectDir, filename));
  return path.join(pathManager.projectDir, '.xbell/unit', relativePath);
}

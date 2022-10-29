import * as url from 'node:url';
import { pathManager } from '../common/path-manager';

const FILE_PREFIX = 'file://';

export function fileURLToPath(fileURL: string) {
  if (fileURL.startsWith(FILE_PREFIX)) {
    return url.fileURLToPath(fileURL)
  }

  return fileURL;
}

export function getProjectRelativePath(pathname: string) {
  return pathname.replace(pathManager.projectDir + '/', '')
}

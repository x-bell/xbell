import * as url from 'node:url';
import * as path from 'node:path';
import { pathManager } from '../common/path-manager';
import { XBELL_BUNDLE_PREFIX, XBELL_ACTUAL_BUNDLE_PREFIX } from '../constants/xbell';

const FILE_PREFIX = 'file://';

const xbellPrefixs = [
  XBELL_BUNDLE_PREFIX,
  XBELL_ACTUAL_BUNDLE_PREFIX,
] as const;

export function fileURLToPath(fileURL: string) {
  if (fileURL.startsWith(FILE_PREFIX)) {
    return url.fileURLToPath(fileURL)
  }

  return fileURL;
}

export function getProjectRelativePath(pathname: string) {
  return pathname.replace(pathManager.projectDir + '/', '')
}

export function resolvePath(modulePath: string, importer?: string) {

  if (!modulePath) return null;

  if (modulePath.includes('.') && importer) {
    return path.resolve(
      path.dirname(importer),
      modulePath
    );
  }

  return modulePath;
}


export function idToUrl(id: string, prefix = XBELL_BUNDLE_PREFIX) {
  const hasPrefix = xbellPrefixs.some(prefix => id.includes(prefix));
  if (hasPrefix) {
    return id;
  }
  return id.includes(pathManager.projectDir)
      ? id.replace(pathManager.projectDir, `/${prefix}`)
      : (`/${prefix}/@fs` + id);
}

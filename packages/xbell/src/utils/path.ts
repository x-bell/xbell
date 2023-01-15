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

export function idToUrl(id: string, prefix = XBELL_BUNDLE_PREFIX) {
  const hasPrefix = xbellPrefixs.some(prefix => id.includes(prefix));
  if (hasPrefix) {
    return id;
  }

  const url = id.includes(pathManager.projectDir)
      ? id.replace(pathManager.projectDir, `/${prefix}`)
      : (`/${prefix}/@fs` + id);
  const [urlPath, urlSearch] = url.split('?');
  if (!urlSearch) {
    return url;
  }

  const urlSearchItems = urlSearch.split('&');
  const hasURLSearch = urlSearchItems.some(item => item === 'url')
  const hasImportSearch = urlSearchItems.some(item => item === 'import');
  if (hasURLSearch && !hasImportSearch) {
    return [
      urlPath,
      [...urlSearchItems, 'import'].join('&'),
    ].join('?');
  }

  return url;
}

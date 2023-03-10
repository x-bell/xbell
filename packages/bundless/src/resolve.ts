// TODO: support alias
import type { FileInfo, PackageInfo } from './types';
import { join, isAbsolute } from 'node:path';
import { dirname } from './utils';
import * as fs from 'node:fs';
import * as url from 'url';
import { getPackageInfo, resolvePackageSubPath } from './pkg';
import { resolveFile } from './utils';
import debug from 'debug';
const __filename = url.fileURLToPath(new URL(import.meta.url));
const PKG_NAME_REG = /^(@[^/]+\/)?[^/]+/;

const debugBundless = debug('xbell:bundless');
class Resolver {
  static create({

  }: {
    conditions?: string[];
    extensions?: string[];
  }) {

  }
}

const fileProtocol = 'file://';

function isRelativePath(specifier: string) {
  return specifier.startsWith('.');
}



// function checkPackage(specifier: string): PackageInfo | null {
//   const m = specifier.match(PKG_NAME_REG);
//   if (!m) {
//     return null;
//   }
//   const [packageName] = m;
//   // TODO: get by arguments
//   const cwd = process.cwd();
//   const subPath = packageName.includes(packageName + '/') ? specifier.replace(packageName, '.') : null;
//   const pkgInfo = getPackageInfo({
//     cwd,
//     packageName,
//   });

//   if (!pkgInfo) return null;

//   return pkgInfo;
// }

function resolvePackage({
  conditions,
  specifier,
}: {
  conditions: string[];
  specifier: string;
}): string | undefined {
  const m = specifier.match(PKG_NAME_REG);
  if (!m) {
    return undefined;
  }
  const [packageName] = m;
  // TODO: get by arguments
  const cwd = process.cwd();
  const subPath = specifier.includes(packageName + '/') ? specifier.replace(packageName, '.') : '.';
  const packageInfo = getPackageInfo({
    cwd,
    packageName,
  });

  debugBundless('resolvePackage::1', subPath, packageInfo?.packageJSON.exports);

  if (packageInfo) {
    if (subPath) {
      return resolvePackageSubPath({
        conditions,
        packageInfo,
        subPath,
      });
    }
    return packageInfo.entry;
  }
}

export function resolve({
  specifier,
  importer,
  conditions,
}: {
  specifier: string;
  importer: string;
  conditions?: string[];
}): string {
  debugBundless('before', 'specifier:', specifier, 'importer:', importer, 'condition:', conditions)
  conditions = [...(conditions ?? []).filter(condition => condition !== 'default')]
  if (!conditions.includes('import')) {
    conditions.push('import');
  }

  if (!conditions.includes('default')) {
    conditions.push('default');
  }

  if (isRelativePath(specifier)) {
    const fullSpecifierMaybeWithoutSuffix = join(
      dirname(importer),
      specifier
    );
    const filename = resolveFile(fullSpecifierMaybeWithoutSuffix);
    if (!filename) throw new Error(`Not found path "${specifier}" from "${importer}"`);
    return filename;
  }

  if (isAbsolute(specifier)) {
    const filename = resolveFile(specifier);
    if (!filename) throw new Error(`Not found path "${specifier}"`);
    return filename;
  }
  
  const packageEntry = resolvePackage({
    specifier,
    conditions, 
  });

  if (packageEntry) {
    return packageEntry;
  }

  throw new Error(`Cannot resolve path "${specifier}"`);

}


import type { PackageInfo, PackageJSON } from './types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { defaultConditions } from './constants';
const __filename = url.fileURLToPath(new URL(import.meta.url));

function getPathByExports({
  dir,
  exports,
  subPath,
  conditions
}: {
  dir: string;
  exports: Record<string, any>;
  subPath: string;
  conditions: string[];
}): string | null {
  const subPathMap = exports[subPath];
  if (subPathMap) {
    const targetSubPath = conditions.find(condition => subPathMap[condition])
    if (targetSubPath) {
      return path.join(dir, targetSubPath);
    }
  }

  return null;
}

export function getPackageEntry({
  packageJSON,
  conditions,
  dir,
}: {
  dir: string;
  packageJSON: PackageJSON;
  conditions: string[]
}) {
  if (packageJSON.exports) {
    const ret = getPathByExports({
      dir,
      subPath: '.',
      exports: packageJSON.exports!,
      conditions,
    });
  
    if (!ret) throw `Not found entry of "${packageJSON.name}"`;
    return ret;
  }

  if (packageJSON.module) {
    return path.join(dir, packageJSON.module);
  }

  if (packageJSON.main) {
    return path.join(dir, packageJSON.main);
  }

  throw `Not found entry of "${packageJSON.name}"`;
}

export function getPackageInfo(cwd: string, pgkName: string): PackageInfo | null {
  const expectedPkgDir = path.join(
    cwd,
    'node_modules',
    pgkName
  );
  const stat = fs.lstatSync(expectedPkgDir);

  if (stat.isSymbolicLink()) {
    const ret = fs.readlinkSync(expectedPkgDir);
    const pkgDir = path.join(__filename, ret);
    const packageJSON = getPackageJSON(pkgDir);
    return {
      type: 'package',
      dir: pkgDir,
      entry: getPackageEntry({
        dir: pkgDir,
        conditions: defaultConditions,
        packageJSON,
      }),
      packageJSON,
    };
  }

  if (stat.isDirectory()) {
    const packageJSON = getPackageJSON(expectedPkgDir);

    return {
      type: 'package',
      dir: expectedPkgDir,
      entry: getPackageEntry({
        dir: expectedPkgDir,
        conditions: defaultConditions,
        packageJSON,
      }),
      packageJSON,
    };
  }

  return null;
}

function getPackageJSON(pkgDir: string): PackageJSON {
  const pkgJSONPath = path.join(
    pkgDir,
    'package.json',
  );
  const jsonStr = fs.readFileSync(pkgJSONPath, 'utf-8');
  const pkgJSON = JSON.parse(jsonStr);

  return pkgJSON;
}

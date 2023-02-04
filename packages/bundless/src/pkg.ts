import type { PackageInfo, PackageJSON, PackageJSONExportsField } from './types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { defaultConditions } from './constants';
import debug from 'debug';
import { resolveFile } from './utils';
const __filename = url.fileURLToPath(new URL(import.meta.url));

const debugPkg = debug('xbell:pkg');
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

export function getPackageInfo({
  cwd,
  packageName,
}: {
  cwd: string;
  packageName: string
}): PackageInfo | null {
  const expectedPkgDir = path.join(
    cwd,
    'node_modules',
    packageName,
  );
  const stat = fs.lstatSync(expectedPkgDir);

  if (stat.isSymbolicLink()) {
    const ret = fs.readlinkSync(expectedPkgDir);
    const pkgDir = path.join(path.dirname(expectedPkgDir), ret);
    debugPkg('pkgDir', pkgDir);
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

export function resolvePackageSubPath({
  conditions,
  packageInfo,
  subPath,
}: {
  conditions: string[]
  packageInfo: PackageInfo;
  subPath: string;
}): string | undefined {
  const { packageJSON } = packageInfo;
  if (packageJSON.exports) {
    return getSubPathByExports({
      exportsField: packageJSON.exports,
      packageDir: packageInfo.dir,
      conditions,
      subPath,
    });
  }

  if (subPath === '.') {
    return packageJSON.module ?? packageJSON.main;
  }

  return;
}

function getSubPathByExports({
  exportsField,
  subPath,
  conditions,
  packageDir
}: {
  exportsField: PackageJSONExportsField;
  subPath: string;
  conditions: string[];
  packageDir: string;
}): string | undefined {
  const target = exportsField[subPath];
  if (target) {
    if (typeof target === 'string') {
      return path.join(packageDir, target);
    }

    const condition = conditions.find(condition => target[condition]);
    if (condition) {
      return path.join(packageDir, target[condition] as string);
    }
  }

  return resolveFile(path.join(packageDir, subPath));
}

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
    return getPathByExports({
      dir,
      subPath: '.',
      exports: packageJSON.exports!,
      conditions,
    });
  }
}

export async function getPackageInfo(cwd: string, pgkName: string): Promise<PackageInfo | null> {
  const expectedPkgDir = path.join(
    cwd,
    'node_modules',
    pgkName
  );
  const stat = fs.lstatSync(expectedPkgDir);

  if (stat.isSymbolicLink()) {
    const ret = fs.readlinkSync(expectedPkgDir);
    const pkgDir = path.join(__filename, ret);
    const packageJSON = await getPackageJSON(pkgDir);
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
    const packageJSON = await getPackageJSON(expectedPkgDir);

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

async function getPackageJSON(pkgDir: string): Promise<PackageJSON> {
  const pkgJSONPath = path.join(
    pkgDir,
    'package.json',
  );

  const { default: pkgJSON } = await import(pkgJSONPath, {
    assert: { type: 'json' }
  });

  return pkgJSON;
}

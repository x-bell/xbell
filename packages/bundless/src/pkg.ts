import type { PackageInfo } from './types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(new URL(import.meta.url));

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
    return {
      type: 'package',
      dir: pkgDir,
      entry: '',
      packageJSON: await getPackageJSON(pkgDir),
    };
  }

  if (stat.isDirectory()) {
    return {
      type: 'package',
      dir: expectedPkgDir,
      entry: '',
      packageJSON: await getPackageJSON(expectedPkgDir), 
    };
  }

  return null;
}

async function getPackageJSON(pkgDir: string): Promise<object> {
  const pkgJSONPath = path.join(
    pkgDir,
    'package.json',
  );

  const { default: pkgJSON } = await import(pkgJSONPath, {
    assert: { type: 'json' }
  });

  return pkgJSON;
}

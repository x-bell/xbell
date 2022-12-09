// TODO: support alias

import { join, dirname, isAbsolute } from 'node:path';
import * as fs from 'node:fs';
import * as url from 'url';

const __filename = url.fileURLToPath(new URL(import.meta.url));


const PKG_NAME_REG = /^(@[^/]+\/)?[^/]+/;

class Resolver {
  static create({

  }: {
    conditions?: string[];
    extensions?: string[];
  }) {

  }
}

const fileProtocol = 'file://';

const extensions = [
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
  '.cjs',
];

function resolveNormalFile(fullSpecifierMaybeWithoutSuffix: string): string | null {
  const existed = fs.existsSync(fullSpecifierMaybeWithoutSuffix);

  if (!existed) {
    const ext = extensions.find(ext => fs.existsSync(fullSpecifierMaybeWithoutSuffix + ext));
    return ext ? fullSpecifierMaybeWithoutSuffix + ext : null;
  }

  const stats = fs.statSync(fullSpecifierMaybeWithoutSuffix);
  if (stats.isFile()) {
    return fullSpecifierMaybeWithoutSuffix;
  }
  if (stats.isDirectory()) {
    return resolveNormalFile(join(fullSpecifierMaybeWithoutSuffix, 'index'));
  }

  return extensions.find(ext => resolveNormalFile(join(fullSpecifierMaybeWithoutSuffix + ext))) ?? null;
}


function isRelativePath(specifier: string) {
  return specifier.startsWith('.');
}

function resolvePackage(cwd: string, pgkName: string): string {
  const expectedFilepath = join(
    cwd,
    'node_modules',
    pgkName
  );
  const stat = fs.lstatSync(expectedFilepath);

  if (stat.isSymbolicLink()) {
    const ret = fs.readlinkSync(expectedFilepath);
    const realPath = join(__filename, ret);
    return realPath;
  }

  if (stat.isDirectory()) {
    return expectedFilepath;
  }
  return ''
}

function checkPackage(specifier: string): null | {
  packageName: string;
  entry: string;
} {
  const m = specifier.match(PKG_NAME_REG);
  if (!m) {
    return null;
  }
  const packageName = m[0];
  // TODO: get by arguments
  const cwd = process.cwd();
  return {
    entry: resolvePackage(cwd, packageName),
    packageName,
  }
}

export function resolve({
  specifier,
  importer,
}: {
  specifier: string;
  importer: string;
}) {
  if (isRelativePath(specifier)) {
    const fullSpecifierMaybeWithoutSuffix = join(
      dirname(importer),
      specifier
    );
    const filename = resolveNormalFile(fullSpecifierMaybeWithoutSuffix);
    if (!filename) throw new Error(`Not found path "${specifier}" from "${importer}"`);
    return {
      filename,
    }
  }

  if (isAbsolute(specifier)) {
    const filename = resolveNormalFile(specifier);
    if (!filename) throw new Error(`Not found path "${specifier}"`);
  }
  const pkgRet = checkPackage(specifier);
  if (pkgRet) {
    return {
      filename: pkgRet.entry,
    }
  }

  throw new Error(`Cannot resolve path "${specifier}"`);

}


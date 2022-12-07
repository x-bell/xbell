// TODO: support alias

import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, basename, dirname, isAbsolute } from 'node:path';
import * as fs from 'node:fs';

// const { CachedInputFileSystem, ResolverFactory } = enhancedResolve;

// const resolver = ResolverFactory.createResolver({
//   extensions: ['.js', '.ts', '.jsx','.tsx', '.json'],
//   fileSystem: new CachedInputFileSystem(fs),
//   // conditionNames: ['default'],
//   preferRelative: true,
//   resolveToContext: true,
// });

const PKG_NAME_REG = /^(@[^/]+\/)?[^/]+/;

// export function resolve({
//   path,
//   importer,
// }: {
//   path: string;
//   importer: string
// }): Promise<{
//   filename: string;
//   request: any;
// }> {
//   return new Promise((r, j) => {
//     resolver.resolve({}, importer, path, {}, (err, filename, request) => {
//       if (err || !filename) j(err);
//       else r({
//         filename,
//         request
//       });
//     })
//   })
// }

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

function resolvePackage(cwd: string, pgkName: string) {
  fs.statSync(
    join(
      cwd,
      'node_modules',
      pgkName
    )
  )
}

function parsePackage(specifier: string): null | {
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
    entry
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

  if (parsePackage(specifier)) {
    return {
      filename,
    }
  }

  throw new Error(`Cannot resolve path "${specifier}"`);

}


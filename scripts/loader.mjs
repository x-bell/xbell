
import process from 'node:process';
import * as fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformSync } from '@swc/core';
import { join, dirname } from 'node:path';

process.setSourceMapsEnabled(true);

const tsParserConfig = {
  syntax: 'typescript',
  decorators: true,
  tsx: true,
};

const jscConfig = {
  parser: tsParserConfig,
  transform: {
      decoratorMetadata: true,
      legacyDecorator: true,
      react: {
          runtime: 'classic',
      }
  },
  target: 'es2020',
};

function _transform(sourceCode, filename) {
  const { code } = transformSync(sourceCode, {
    sourceMaps: 'inline',
    filename,
    module: {
        type: 'nodenext'
    },
    jsc: jscConfig,
});
  return { code };
}

const fileProtocol = 'file://';

function isPath(urlOrPath) {
  return urlOrPath.startsWith(fileProtocol);
}

function ensurePath(urlOrPath) {
  if (urlOrPath.startsWith(fileProtocol)) {
    return fileURLToPath(urlOrPath);
  }

  return urlOrPath;
}

const extensions = [
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
  '.cjs',
];

function resolveFile(filepath) {
  const existed = fs.existsSync(filepath);

  if (!existed) {
    const ext = extensions.find(ext => fs.existsSync(filepath + ext));
    return ext ? filepath + ext : undefined;
  }

  const stats = fs.statSync(filepath);
  if (stats.isFile()) {
    return filepath;
  }
  if (stats.isDirectory()) {
    return resolveFile(join(filepath, 'index'));
  }

  return extensions.find(ext => resolveFile(join(filepath + ext)));
}

export function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;
  const ret = resolveFile(
    parentURL ? join(
      dirname(ensurePath(parentURL)),
      ensurePath(specifier)
    ) : ensurePath(specifier)
  );

  if (ret) {
    const url = pathToFileURL(ret).href;
    return {
      url,
      shortCircuit: true,
    }
  }
  return nextResolve(specifier, context, nextResolve);
}

export function load(url, context, nextLoad) {
  if (/\.(tsx|ts)$/.test(url)) {
    const filePath = fileURLToPath(url);
    const { code } = _transform(
      fs.readFileSync(filePath, "utf-8"),
      filePath
    );

    return {
      shortCircuit: true,
      format: 'module',
      source: code,
    };
  }
  return nextLoad(url, context);
}

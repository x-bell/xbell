import process from 'node:process';
import * as fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, dirname } from 'node:path';
import { compileNodeJSCode } from "../dist/compiler/compile-node.mjs";
import debug from 'debug';

process.setSourceMapsEnabled(true);
const debugLoader = debug('xbell:loader')
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
    // if (url.endsWith('ts')) {
    //   debugLoader('url', url);
    // }
    return {
      url,
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  // debugLoader('url', url);
  if (/\.(tsx|ts)$/.test(url)) {
    const filePath = fileURLToPath(url);
    const { code } = compileNodeJSCode(
      fs.readFileSync(filePath, "utf-8"),
      filePath,
      'inline',
    );
    // if (filePath.endsWith('ts')) {
    //   debugLoader('code', filePath, code);
    // }
    return {
      shortCircuit: true,
      format: 'module',
      source: code,
    };
  }
  return nextLoad(url, context);
}

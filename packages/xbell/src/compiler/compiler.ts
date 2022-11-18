import * as path from 'node:path';
import { transformSync, parseSync, Expression, Import, Super, CallExpression } from '@swc/core';
import { jscConfig, tsParserConfig } from './config';
import { BrowserPathCollector } from './borwser-path-collector';
import { browserBuilder } from '../core/browser-builder';

import debug from 'debug';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { compileNodeJSCode } from './compile-node';
const debugCompiler = debug('xbell:compiler');

export interface XBellCompilerDeps {
  queryResolveId(path: string, importer: string): Promise<string>;
}

export class Compiler {
  public nodeJSCache = new Map<string, { code: string }>();
  public browserSourceCodeMapByCode = new Map<string, { sourceCode: string; map: string; }>();


  public compileNodeJSCode(
    sourceCode: string,
    filename: string
  ) {
    return compileNodeJSCode(sourceCode, filename, true, this.nodeJSCache);
  }

  public async compileBrowserCode(sourceCode: string) {
    debugCompiler('=====compile-browser======', sourceCode);
    const program = parseSync(sourceCode, {
      ...tsParserConfig,
    });

    const server = await browserBuilder.server;
    const pathCollector = new BrowserPathCollector();
    pathCollector.visitProgram(program);
    const idMapByFullPath = new Map<string, string>();
    const paths =  Array.from(pathCollector.paths).filter(path => !path.includes(XBELL_BUNDLE_PREFIX));
    for (const path of paths) {
      const moduleId = await server.queryId(path);
      if (moduleId) {
        idMapByFullPath.set(path, moduleId);
      } else {
        const err = new Error(`not found module: "${path}"`)
        err.name = 'CompileError';
        throw err;
      }
    }
  
    const generator = new BrowserPathCollector(idMapByFullPath);
    const browserProgram = generator.visitProgram(program);

    const { code, map } = transformSync(browserProgram, {
      module: {
        type: 'es6'
      },
      jsc: {
        ...jscConfig,
        target: 'es2020',
      },
      sourceMaps: true
    });

    this.browserSourceCodeMapByCode.set(code, {
      sourceCode,
      map: map!,
    });

    return {
      code,
      map,
    }
  }
}

export const compiler = new Compiler();

import * as path from 'node:path';
import { transformSync, parseSync, Expression, Import, Super, CallExpression } from '@swc/core';
import { jscConfig, tsParserConfig } from './config';
import { ASTPathCollector } from './ast-path-collector';
import { browserBuilder } from '../core/browser-builder';
import { Visitor } from './visitor';
import debug from 'debug';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';

const debugCompiler = debug('xbell:compiler');

export interface XBellCompilerDeps {
  queryResolveId(path: string, importer: string): Promise<string>;
}

export interface XBellCompiler {
  compileNodeJSCode(sourceCode: string, filename: string): Promise<{ code: string }>
  compileBrowserCode(sourceCode: string): Promise<{ code: string }>
}

function resolvePath(modulePath: string, importerPath?: string) {

  if (!modulePath) return null;

  if (modulePath.includes('.') && importerPath) {
    return path.resolve(
      path.dirname(importerPath),
      modulePath
    )
  }

  return null;
}
export interface XBellCompilerConstructor {
  new (desp: XBellCompilerDeps): XBellCompiler
}

class NodeJSVisitor extends Visitor {
  constructor(protected _filename: string) {
    super();
  }

  visitCallExpression(n: CallExpression): Expression {
    debugCompiler('visitCallExpression');
    const expression = n.arguments[0]?.expression;
    if (n.callee.type === 'Import' && expression?.type === 'StringLiteral' && expression.value.startsWith('.')) {
      const fullpath = resolvePath(expression.value, this._filename);
      if (fullpath) {
        debugCompiler('fullpath', fullpath, expression.value, this._filename);
        expression.value = fullpath;
        // @ts-ignore
        delete expression.raw;
      }
    }
    return super.visitCallExpression(n);
  }
}

export class Compiler {
  public nodeJSCache = new Map<string, { code: string }>();
  public browserSourceCodeMapByCode = new Map<string, { sourceCode: string; map: string; }>();

  public async compileNodeJSCode(sourceCode: string, filename: string): Promise<{ code: string; }> {
    const program = parseSync(sourceCode, {
      ...tsParserConfig,
    });
    const vistor = new NodeJSVisitor(filename);
    const finalProgram = vistor.visitProgram(program);
    const { code, map } = transformSync(finalProgram, {
      sourceMaps: 'inline',
      module: {
        type: 'nodenext',
      },
      jsc: {
        ...jscConfig,
      }
    });
    debugCompiler('nodejs:code', { map, code });
    if (!this.nodeJSCache.has(filename)) {
      this.nodeJSCache.set(filename, { code });
    }

    return this.nodeJSCache.get(filename)!;
  }

  public async compileBrowserCode(sourceCode: string) {
    debugCompiler('=====compile-browser======', sourceCode);
    const program = parseSync(sourceCode, {
      ...tsParserConfig,
    });

    const server = await browserBuilder.server;
    const pathCollector = new ASTPathCollector();
    pathCollector.visitProgram(program);
    const aliasMap = new Map<string, string>();
    const paths =  Array.from(pathCollector.paths).filter(path => !path.includes(XBELL_BUNDLE_PREFIX));
    for (const path of paths) {
      const moduleUrl = await server.queryId(path);
      debugCompiler('queryUrl', path, moduleUrl);
      if (moduleUrl) {
        aliasMap.set(path, moduleUrl);
      } else {
        const err = new Error(`not found module: "${path}"`)
        err.name = 'CompileError';
        throw err;
      }
    }
  
    const generator = new ASTPathCollector(aliasMap);
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

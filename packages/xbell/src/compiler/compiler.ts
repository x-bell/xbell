import * as path from 'node:path';
import { transformSync, parseSync, ArrowFunctionExpression, Module, FunctionDeclaration } from '@swc/core';
import { getJSCConfig, tsParserConfig } from './config';
import { BrowserPathCollector } from './borwser-path-collector';

import debug from 'debug';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { compileNodeJSCode } from './compile-node';
import { replaceJSX } from '../utils/jsx';
import { genJSXAutomaticAsyncImport } from './jsx';
import { crossEnv } from '../common/cross-env';
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

  protected genBrowserJSXCode(program: Module) {
    function handleArrowFunctionExpression(target: FunctionDeclaration | ArrowFunctionExpression) {
      if (target.body.type === 'BlockStatement') {
        target.body.stmts = [
          genJSXAutomaticAsyncImport({
            span: target.span,
            jsxExportName: 'jsx',
            jsxAliasName: '_jsx',
            importSource: crossEnv.get('jsxImportSource'),
  
          }),
          ...target.body.stmts,
        ]
      }
    }
    if (program.type === 'Module') {
      const [firstElement] = program.body;
      if (firstElement.type === 'FunctionDeclaration') {
        handleArrowFunctionExpression(firstElement)
      } else if (firstElement.type === 'ExpressionStatement' && firstElement.expression.type === 'ArrowFunctionExpression') {
        handleArrowFunctionExpression(firstElement.expression);
      }
    }
    return program;
  }

  public async compileBrowserCode(sourceCode: string) {
    debugCompiler('sourceCode', sourceCode);

    const rawProgram = parseSync(sourceCode, {
      ...tsParserConfig,
    });
    const jsxRuntime = crossEnv.get('jsxRuntime');
    const program = jsxRuntime === 'automatic' && sourceCode.includes('_jsx') ? this.genBrowserJSXCode(rawProgram) : rawProgram;

    const pathCollector = new BrowserPathCollector();
    pathCollector.visitProgram(program);
    const jscConfig = getJSCConfig();
    const { code: codeWithXBellJSX, map } = transformSync(program, {
      module: {
        type: 'es6'
      },
      jsc: {
        ...jscConfig,
        transform: {
          ...jscConfig.transform,
          // already compiled in nodejs
          react: undefined,
        },
        target: 'es2020',
      },
      sourceMaps: true
    });

    const code = replaceJSX(codeWithXBellJSX);

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


import { transformSync, parseSync } from '@swc/core';
import { jscConfig, tsParserConfig } from './config';
import { ASTPathCollector } from './ast-path-collector';
import { browserBuilder } from '../core/browser-builder';

export interface XBellCompilerDeps {
  queryResolveId(path: string, importer: string): Promise<string>;
}

export interface XBellCompiler {
  compileNodeJSCode(sourceCode: string, filename: string): Promise<{ code: string }>
  compileBrowserCode(sourceCode: string, filename: string): Promise<{ code: string }>
}

export interface XBellCompilerConstructor {
  new (desp: XBellCompilerDeps): XBellCompiler
}


export class Compiler {
  public async compileNodeJSCode(sourceCode: string, filename: string): Promise<{ code: string; }> {
    const { code } = transformSync(sourceCode, {
      sourceMaps: 'inline',
      filename,
      module: {
        type: 'nodenext'
      },
      jsc: {
        ...jscConfig,
      },
    });
    return { code }; 
  }

  public async compileBrowserCode(sourceCode: string, filename: string) {
      const program = parseSync(sourceCode, {
        ...tsParserConfig,
      });

      const server = await browserBuilder.server;
      const pathCollector = new ASTPathCollector();
      pathCollector.visitProgram(program);
      const aliasMap = new Map<string, string>();
      const paths =  Array.from(pathCollector.paths);
      for (const path of paths) {
        try {
          const moduleUrl = await server.queryUrl(path, filename);
          if (moduleUrl) {
            aliasMap.set(path, moduleUrl);
          }
        } catch(err) {
          console.log('error', err);
        }
      }
    
      const generator = new ASTPathCollector(aliasMap)
      const browserProgram = generator.visitProgram(program);
      const { code } = transformSync(browserProgram, {
        module: {
          type: 'es6'
        },
        jsc: {
          ...jscConfig,
          target: 'es2020',
        },
      });
      return {
        code,
      }
  }
}

export const compiler = new Compiler();

import {
  parseSync,
  CallExpression,
  Expression,
  transformSync,
} from '@swc/core';
import { ViteDevServer } from 'vite';

import { tsParserConfig, jscConfig } from './config';
import { Visitor } from './visitor';


class PathCollector extends Visitor {
  public paths = new Set<string>()

  constructor(public urlMap?: Map<string, string>) {
    super()
  }

  visitCallExpression(n: CallExpression): Expression {
    if (n.callee.type === 'Import' && n.arguments[0].expression.type === 'StringLiteral') {
      if (!this.urlMap) {
        this.paths.add(n.arguments[0].expression.value);
      } else {
        const targetUrl = this.urlMap.get(n.arguments[0].expression.value)?.replace(process.cwd(), '');
        // @ts-ignore
        delete n.arguments[0].expression.raw;
        n.arguments[0].expression.value = targetUrl as string;
      }
    }
    return n;
  }
}

export async function transformBrowserCode(sourceCode: string, filename: string, devServer: ViteDevServer) {
  const program = parseSync(sourceCode, {
    ...tsParserConfig,
  });
  const pathCollector = new PathCollector()
  pathCollector.visitProgram(program);
  const aliasMap = new Map<string, string>();
  const paths =  Array.from(pathCollector.paths);
  for (const path of paths) {
    const resolved = await devServer.pluginContainer.resolveId(path, filename, { ssr: false })
    if (resolved) {
      aliasMap.set(path, resolved.id);
    }
  }

  const generator = new PathCollector(aliasMap)
  const browserProgram = generator.visitProgram(program)
  const { code } = transformSync(browserProgram, {
    module: {
      type: 'es6'
    },
    jsc: {
      ...jscConfig,
      target: 'es2020',
    },
  });
  return code;
}
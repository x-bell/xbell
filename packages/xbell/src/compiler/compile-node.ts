import { resolvePath } from '../utils/resolve';
import { Visitor } from './visitor';
import { transformSync, parseSync, Expression, Import, Super, CallExpression } from '@swc/core';

import { jscConfig, tsParserConfig } from './config';


class NodeJSVisitor extends Visitor {
  constructor(protected _filename: string) {
    super();
  }

  visitCallExpression(n: CallExpression): Expression {
    const expression = n.arguments[0]?.expression;
    if (n.callee.type === 'Import' && expression?.type === 'StringLiteral' && expression.value.startsWith('.')) {
      const fullpath = resolvePath(expression.value, this._filename);
      if (fullpath) {
        // debugCompiler('fullpath', fullpath, expression.value, this._filename);
        expression.value = fullpath;
        // @ts-ignore
        delete expression.raw;
      }
    }
    return super.visitCallExpression(n);
  }
}

export async function compileNodeJSCode(
  sourceCode: string,
  filename: string,
  cache?: Map<string, { code: string }>,
): Promise<{ code: string; }> {
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
  // debugCompiler('nodejs:code', { map, code });
  if (cache) {
    if (!cache.has(filename)) {
      cache.set(filename, { code });
    }
  }

  return { code }!;
}
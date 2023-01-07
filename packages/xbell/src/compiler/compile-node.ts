import { resolvePath } from '../utils/resolve';
import { replaceJSX } from '../utils/jsx';
import { Visitor } from './visitor';
import { transformSync, parseSync, Expression, Import, Super, CallExpression } from '@swc/core';

import { getJSCConfig, tsParserConfig } from './config';


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

export function compileNodeJSCode(
  sourceCode: string,
  filename: string,
  sourceMaps: boolean | 'inline',
  cache?: Map<string, { code: string, map?: string }>,
): { code: string; map?: string } {
  const program = parseSync(sourceCode, {
    ...tsParserConfig,
  });

  const vistor = new NodeJSVisitor(filename);
  const finalProgram = vistor.visitProgram(program);
  const { code: codeWithXBellJSX, map } = transformSync(finalProgram, {
    filename,
    sourceFileName: filename,
    sourceMaps,
    module: {
      type: 'nodenext',
    },
    jsc: getJSCConfig(),
  });
  const code = replaceJSX(codeWithXBellJSX);
  if (cache) {
    if (!cache.has(filename)) {
      cache.set(filename, { code, map });
    }
  }

  return { code, map }!;
}

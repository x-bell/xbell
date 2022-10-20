import { Visitor } from './visitor';
import {
  parseSync,
  CallExpression,
  Expression,
  transformSync,
  JSXElement,
  BlockStatement,
  Statement,
  Identifier,
  KeyValuePatternProperty,
  ObjectPatternProperty
} from '@swc/core';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { pathManager } from '../common/path-manager';

export class ASTPathCollector extends Visitor {
  public paths = new Set<string>()
  constructor(public urlMap?: Map<string, string>) {
    super()
  }

  visitJSXElement(n: JSXElement): JSXElement {
    return super.visitJSXElement(n)
  }

  visitBlockStatement(block: BlockStatement): BlockStatement {
    // if (this.urlMap) {
    //   const { span } = block;
    //   const jsxRuntime = genVariableDeclaration({
    //     span,
    //     // init: genAwaitExpression()
    //     // init: genAwaitExpression()
    //     declarations: [
    //       genVariableDeclarator({
    //         span,
    //         id: genObjectPattern({
    //           span,
    //           properties: [
    //             genKeyValuePatternProperty({
    //               key: genIdentifier({
    //                 span,
    //                 value: 'default',
    //               }),
    //               value: genIdentifier({
    //                 span,
    //                 value: '_jsx',
    //               })
    //             })
    //           ] // TODO:
    //         }),
    //         init: genAwaitExpression({
    //           span,
    //           argument: genCallExpression({
    //             span,
    //             callee: genImport({
    //               span,
    //             }),
    //             arguments: [
    //               genArgument({
    //                 expression: genStringLiteral({
    //                   value: 'react/jsx-runtime',
    //                   span,
    //                 }),
    //               })
    //             ]
    //           }) // TODO
    //         }),
    //       })
    //     ]
    //   });

    //   block.stmts = [
    //     // jsxRuntime,
    //     ...block.stmts,
    //   ]
    //   // console.log('jsxRuntime', JSON.stringify(jsxRuntime));
    // }
    // this.stmts = block.stmts;
    block.stmts = this.visitStatements(block.stmts);
    return block;
  }

  visitIdentifier(n: Identifier): Identifier {
    if (this.urlMap && (n.value === 'React1' || n.value === '_jsx1')) {
      n.value = n.value.replace(/1$/, '');
    }
    return n;
  }

  visitCallExpression(n: CallExpression): Expression {
    // process relative path
    if (n.callee.type === 'Import' && n.arguments[0].expression.type === 'StringLiteral') {
      if (!this.urlMap) {
        this.paths.add(n.arguments[0].expression.value);
      } else {
        const rawValue = n.arguments[0].expression.value
        if (!rawValue.includes(XBELL_BUNDLE_PREFIX)) {
          const resolveId = this.urlMap.get(rawValue)!;
          const targetUrl = rawValue.includes(pathManager.projectDir)
            ? resolveId.replace(pathManager.projectDir, `/${XBELL_BUNDLE_PREFIX}`)
            : (`/${XBELL_BUNDLE_PREFIX}/@fs` + resolveId);
          // const prefix = '/' + XBELL_BUNDLE_PREFIX;
          // const targetUrl = prefix + this.urlMap.get(n.arguments[0].expression.value);
          // @ts-ignore
          delete n.arguments[0].expression.raw;
          n.arguments[0].expression.value = targetUrl as string;
        }
      }
    }
    return n;
  }
}

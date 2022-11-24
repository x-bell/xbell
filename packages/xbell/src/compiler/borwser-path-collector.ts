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
import { idToUrl } from '../utils/path';

const originModulePathByUrl = new Map<string, string>();

export class BrowserPathCollector extends Visitor {
  public paths = new Set<string>()
  constructor(public idMapByFullpath?: Map<string, string>) {
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

  // visitIdentifier(n: Identifier): Identifier {
  //   if (this.idMapByFullpath && (n.value === 'React1' || n.value === '_jsx1')) {
  //     n.value = n.value.replace(/1$/, '');
  //   }
  //   return n;
  // }

  visitCallExpression(n: CallExpression): Expression {
    if (n.callee.type === 'Import' && n.arguments[0].expression.type === 'StringLiteral') {
      if (!this.idMapByFullpath) {
        // fullpath by node transform
        this.paths.add(n.arguments[0].expression.value);
      } else {
        let rawValue = n.arguments[0].expression.value;
        if (rawValue.includes(XBELL_BUNDLE_PREFIX)) {
          // restore origin module path for get new url
          rawValue = originModulePathByUrl.get(rawValue)!;
        }
        if (!rawValue.includes(XBELL_BUNDLE_PREFIX)) {
          const resolveId = this.idMapByFullpath.get(rawValue)!;
          const targetUrl = idToUrl(resolveId);
          // @ts-ignore
          originModulePathByUrl.set(targetUrl, n.arguments[0].expression.raw);
          // @ts-ignore
          delete n.arguments[0].expression.raw;
          n.arguments[0].expression.value = targetUrl as string;
        }
      }
    }
    return n;
  }
}

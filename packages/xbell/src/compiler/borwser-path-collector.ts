import { Visitor } from './visitor';
import {
  CallExpression,
  Expression,
  JSXElement,
  BlockStatement,
} from '@swc/core';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { idToUrl } from '../utils/path';
import debug from 'debug';

const originModulePathByUrl = new Map<string, string>();
const debugCompiler = debug('xbell:compiler');
export class BrowserPathCollector extends Visitor {
  public paths = new Set<string>()
  constructor(public idMapByFullpath?: Map<string, string>) {
    super()
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
          const targetURL = idToUrl(resolveId);
          debugCompiler('targetURL', targetURL);
          // @ts-ignore
          originModulePathByUrl.set(targetURL, n.arguments[0].expression.raw);
          // @ts-ignore
          delete n.arguments[0].expression.raw;
          n.arguments[0].expression.value = targetURL as string;
        }
      }
    }
    return super.visitCallExpression(n);
  }
}

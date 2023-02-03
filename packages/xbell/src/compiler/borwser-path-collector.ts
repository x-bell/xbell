import { Visitor } from './visitor';
import {
  CallExpression,
  Expression,
} from '@swc/core';
// import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import { fullPathToURL } from '../utils/path';
import debug from 'debug';

// const originModulePathByUrl = new Map<string, string>();
const debugCompiler = debug('xbell:compiler');
export class BrowserPathCollector extends Visitor {
  constructor() {
    super();
  }

  visitCallExpression(n: CallExpression): Expression {
    if (n.callee.type === 'Import' && n.arguments[0].expression.type === 'StringLiteral') {
        // @ts-ignore
        const originFullPath = n.arguments[0].expression.raw;
        // @ts-ignore
        delete n.arguments[0].expression.raw;
        n.arguments[0].expression.value = fullPathToURL(originFullPath)
    }

    return super.visitCallExpression(n);
  }
}

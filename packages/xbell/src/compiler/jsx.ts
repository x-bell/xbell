import {
  parseSync,
  JSXElement,
  TsType,
  ImportDeclaration,
  CallExpression,
  Expression,
  transformSync,
  ObjectExpression,
  KeyValueProperty,
  Identifier,
  PropertyName,
  StringLiteral,
  UnaryExpression,
  Span,
  Program,
  Module
} from '@swc/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Visitor } from './visitor';
import { tsParserConfig, jscConfig } from './config';
import { genKeyValueProperty, genIdentifier, genStringLiteral, genEmptySpan, genVariableDeclaration } from './ast';
import { getBrowserCaseDirPath } from '../unit/path';
class JSXCollector extends Visitor {
  public jsxTagNames = new Set<string>();
  public jsxElements = new Set<JSXElement>();

  visitJSXElement(n: JSXElement): JSXElement {
    this.jsxElements.add(
      JSON.parse(JSON.stringify(n))
    );
    if (n.opening.name.type === 'Identifier') {
      this.jsxTagNames.add(n.opening.name.value);
    }
    return n;
  }

  visitTsType(n: TsType): TsType {
    return n;
  }
}

class NodeJSCaseCoder extends Visitor {
  public importDeclarations = new Set<ImportDeclaration>()

  constructor(public componentNames: Set<string>, public filename: string) {
    super();
  }

  visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
    let addComponent = false;
    for (const specifier of n.specifiers) {
      if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
        if (this.componentNames.has(specifier.local.value)) {
          if (!addComponent) {
            addComponent = true;
            const newImportDecorationNode: ImportDeclaration = JSON.parse(JSON.stringify(n));
            newImportDecorationNode.source.value = path.join(
              path.dirname(this.filename),
              newImportDecorationNode.source.value
            )
            this.importDeclarations.add(newImportDecorationNode)
          }
          // @ts-ignore
          return undefined;
        }
      }
    }
    return n;
  }

  // @ts-ignore
  visitJSXElement(n: JSXElement): ObjectExpression | UnaryExpression {
    if (n.opening.name.type === 'Identifier') {
      const span = n.span;
      const tagName = n.opening.name.value;
      return {
        type: 'ObjectExpression',
        span: n.span,
        properties: [
          genKeyValueProperty(genIdentifier('type', span), genStringLiteral(tagName, span)),
        ]
      }
    }

    return {
      type: 'UnaryExpression',
      span: n.span,
      operator: 'void',
      argument: {
        type: 'NumericLiteral',
        span: n.span,
        value: 0,
      },
    };

  }

  visitTsType(n: TsType): TsType {
    return n;
  }
}

class BrowserCoder extends Visitor {
  constructor(public importDeclarations: Set<ImportDeclaration>) {
    super();
  }
}

export function transformJSX(sourceCode: string, filename: string) {
  const program = parseSync(sourceCode, {
    ...tsParserConfig,
  });

  const jsxCollector = new JSXCollector();

  jsxCollector.visitProgram(program);

  const nodeJsCaseCoder = new NodeJSCaseCoder(jsxCollector.jsxTagNames, filename)
  const nodeJsProgram = nodeJsCaseCoder.visitProgram(program)

  const jsxElements = jsxCollector.jsxElements;
  const importDeclarations = nodeJsCaseCoder.importDeclarations;

  const browserProgram: Module = {
    // @ts-ignore
    interpreter: null,
    type: 'Module',
    span: genEmptySpan(),
    body: [
      ...Array.from(importDeclarations),
      ...Array.from(
        jsxElements
      ).map((jsxElement, idx) => genVariableDeclaration(
        (filename + '_' + idx).replace(/[^\w_\d]/g, '_'), jsxElement
      )),
    ]
  }
  const { code: nodeJSCode, map: nodeJSMap } = transformSync(nodeJsProgram, {
    module: {
      type: 'commonjs'
    },
    jsc: jscConfig,
  });

  const { code: browserCode, map: browserMap } = transformSync(browserProgram, {
    module: {
      type: 'commonjs'
    },
    jsc: jscConfig,
  });


  const browserCaseDir = getBrowserCaseDirPath(filename);

  fs.ensureDirSync(browserCaseDir)
  fs.writeFileSync(path.join(browserCaseDir, 'index.js'), browserCode);

  return {
    code: nodeJSCode,
    map: nodeJSMap,
  }
}

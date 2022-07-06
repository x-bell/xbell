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
} from '@swc/core';
import * as path from 'path';
import { Visitor } from './visitor';
import { tsParserConfig, jscConfig } from './config';


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


function genKeyValueProperty(key: PropertyName, value: Expression): KeyValueProperty {
  return {
    type: 'KeyValueProperty',
    key,
    value,
  }
}

function genIdentifier(span: Span, value: string): Identifier {
  return {
    type: 'Identifier',
    span,
    value,
    optional: false,
  }
}

function genStringLiteral(span: Span, value: string): StringLiteral {
  return {
    type: 'StringLiteral',
    span,
    value: value,
    hasEscape: false,
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
            newImportDecorationNode.source.value = path.join(this.filename, newImportDecorationNode.source.value)
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
          genKeyValueProperty(genIdentifier(span, 'type'), genStringLiteral(span, tagName)),
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

export function transformJSX(sourceCode: string, filename: string) {
  const program = parseSync(sourceCode, {
    ...tsParserConfig,
  });

  const jsxCollector = new JSXCollector();

  jsxCollector.visitProgram(program);

  const nodeJsCaseCoder = new NodeJSCaseCoder(jsxCollector.jsxTagNames, filename)
  const outputProgram = nodeJsCaseCoder.visitProgram(program)

  const { code, map } = transformSync(outputProgram, {
    module: {
      type: 'commonjs'
    },
    jsc: jscConfig,
  });
  return {
    code,
    map,
  }
}

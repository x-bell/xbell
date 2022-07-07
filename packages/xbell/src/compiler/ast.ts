import {
  PropertyName,
  Expression,
  KeyValueProperty,
  Span,
  Identifier,
  StringLiteral,
  VariableDeclaration,
  VariableDeclarator,
  JSXElement
} from '@swc/core';

export function genKeyValueProperty(key: PropertyName, value: Expression): KeyValueProperty {
  return {
    type: 'KeyValueProperty',
    key,
    value,
  }
}

export function genIdentifier(value: string, span: Span): Identifier {
  return {
    type: 'Identifier',
    span,
    value,
    optional: false,
  }
}

export function genStringLiteral(value: string, span: Span): StringLiteral {
  return {
    type: 'StringLiteral',
    span,
    value: value,
    hasEscape: false,
  }
}

export function genEmptySpan(): Span {
  return {
    start: 1,
    end: 2,
    ctxt: 0
  };
}

// 暂仅支持 jsx
export function genVariableDeclarator(variableName: string, jsxElement: JSXElement): VariableDeclarator {
  return {
    type: 'VariableDeclarator',
    span: genEmptySpan(),
    id: genIdentifier(variableName, genEmptySpan()),
    definite: false,
    init: jsxElement
  }
}

export function genVariableDeclaration(variableName: string, jsxElement: JSXElement): VariableDeclaration {
  return {
    type: 'VariableDeclaration',
    span: genEmptySpan(),
    kind: 'const',
    declare: false,
    declarations: [
      genVariableDeclarator(variableName, jsxElement)
    ]
  }
}
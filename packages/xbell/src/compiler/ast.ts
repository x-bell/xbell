import type {
  PropertyName,
  Expression,
  KeyValueProperty,
  Span,
  Identifier,
  StringLiteral,
  VariableDeclaration,
  VariableDeclarator,
  AwaitExpression,
  ObjectPattern,
  ObjectPatternProperty,
  Pattern,
  CallExpression,
  Super,
  Import,
  Argument,
  KeyValuePatternProperty
} from '@swc/core';

export function genKeyValueProperty(key: PropertyName, value: Expression): KeyValueProperty {
  return {
    type: 'KeyValueProperty',
    key,
    value,
  }
}

export function genIdentifier(args: {
  value: string;
  span: Span;
}): Identifier {
  return {
    type: 'Identifier',
    span: args.span,
    value: args.value,
    optional: false,
  }
}

export function genStringLiteral(args: {
  value: string,
  span: Span
}): StringLiteral {
  return {
    type: 'StringLiteral',
    span: args.span,
    value: args.value,
    hasEscape: false,
    // @ts-ignore
    kind: {
      type: 'normal',
      containsQuote: true,
    }
  }
}

export function genEmptySpan(): Span {
  return {
    start: 1,
    end: 2,
    ctxt: 0
  };
}


export function genObjectPattern(args: {
  span: Span;
  properties: ObjectPatternProperty[]
}): ObjectPattern {
  return {
    type: 'ObjectPattern',
    span: args.span,
    properties: args.properties,
    // @ts-ignore
    optional: false,
  }
}

export function genVariableDeclarator(args: {
  init: Expression;
  span: Span;
  id: Pattern;
}): VariableDeclarator {
  return {
    type: 'VariableDeclarator',
    span: args.span,
    id: args.id,
    init: args.init,
    definite: false,
  }
}

// export function genObjectPattern(args: {
//   span: Span
//   properties: ObjectPatternProperty[]
// }): ObjectPattern {
//   return {
//     type: 'ObjectPattern',
//     span: args.span,
//     properties: args.properties,
//   }
// }

export function genVariableDeclaration(
  args: {
    span: Span;
    declarations: VariableDeclarator[]
  }  
): VariableDeclaration {
  return {
    type: 'VariableDeclaration',
    span: args.span,
    kind: 'const',
    declare: false,
    declarations: args.declarations,
  }
}

export function genCallExpression(args: {
  span: Span;
  callee: Expression | Super | Import;
  arguments: Argument[];
}): CallExpression {
  return {
    type: 'CallExpression',
    span: args.span,
    callee: args.callee,
    arguments: args.arguments,
  }
}

export function genImport(args: {
  span: Span;
}): Import {
  return {
    type: 'Import',
    span: args.span,
  }
}

export function genAwaitExpression(args: {
  argument: Expression;
  span: Span
}): AwaitExpression {
  return {
    type: 'AwaitExpression',
    span: args.span,
    argument: args.argument,
  }
}

export function genArgument(args: {
  expression: Expression
}): Argument {
  return {
    expression: args.expression,
  };
}

export function genKeyValuePatternProperty(args: {
  key: Identifier;
  value: Identifier;
}): KeyValuePatternProperty {
  return {
    type: 'KeyValuePatternProperty',
    key: args.key,
    value: args.value,
  };
}

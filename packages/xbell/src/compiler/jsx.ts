import type { Span, VariableDeclaration } from '@swc/core';
import {
  genAwaitExpression,
  genCallExpression,
  genIdentifier,
  genImport,
  genKeyValuePatternProperty,
  genObjectPattern,
  genStringLiteral,
  genVariableDeclaration,
  genVariableDeclarator,
} from './ast';

export function genJSXAutomaticAsyncImport({
  span,
  jsxExportName,
  jsxAliasName,
  importSource,
}: {
  span: Span;
  jsxAliasName: string;
  jsxExportName: string;
  importSource: string;
}): VariableDeclaration {
  return genVariableDeclaration({
    span,
    declarations: [
      genVariableDeclarator({
        span,
        id: genObjectPattern({
          span,
          properties: [
            genKeyValuePatternProperty({
              key: genIdentifier({
                span,
                value: jsxExportName
              }),
              value: genIdentifier({
                span,
                value: jsxAliasName,
              })
            })
          ]
        }),
        init: genAwaitExpression({
          span,
          argument: genCallExpression({
            span,
            callee: genImport({
              span,
            }),
            arguments: [
              {
                expression: genStringLiteral({
                  span,
                  value: `${importSource}/jsx-runtime`
                }),
              }
            ]
          })
        })
      })
    ]
  })
}

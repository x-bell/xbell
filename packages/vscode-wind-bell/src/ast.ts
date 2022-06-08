import { parse, ParseResult } from '@babel/parser';
import { types } from '@babel/core';
import traverse from '@babel/traverse';
import { SourceLocation } from '@babel/types';

export type ICase = {
  caseName: string;
  loc: SourceLocation;
  startIndex: number;
  endIndex: number;
  envs: string[];
  browsers: string[];
};

export type IGroup = {
  groupName: string;
  loc: SourceLocation;
  startIndex: number;
  endIndex: number;
  cases: ICase[];
};

const genAST = (code: string) =>
  parse(
    code,
    {
      errorRecovery: true,
      plugins: ['typescript', 'decorators-legacy'],
      sourceType: 'module'
    }
  );

export function parseGroups(tsCode: string) {
  const ast = genAST(tsCode);
  const groups: IGroup[] = [];
  traverse(ast, {
    ClassDeclaration(path) {
      path.node.decorators?.forEach((node) => {
        if (
          types.isCallExpression(node.expression) &&
          types.isIdentifier(node.expression.callee, { name: 'Group' }) &&
          types.isStringLiteral(node.expression.arguments[0])
        ) {
          const groupName = node.expression.arguments[0].value;
          groups.push({
            groupName: groupName,
            loc: node.loc as SourceLocation,
            startIndex: node.start as number,
            endIndex: node.end as number,
            cases: [],
          });
        }
      });

      if (types.isClassBody(path.node.body)) {
        path.node.body.body.forEach(propertyNode => {
          if (types.isClassMethod(propertyNode) && propertyNode.decorators?.length) {
            propertyNode.decorators.forEach(decoratorNode => {
              if (
                types.isCallExpression(decoratorNode.expression) &&
                types.isIdentifier(decoratorNode.expression.callee, { name: 'Case' }) &&
                types.isStringLiteral(decoratorNode.expression.arguments[0])
              ) {
                groups[groups.length - 1].cases.push({
                  caseName: decoratorNode.expression.arguments[0].value,
                  loc: propertyNode.loc as SourceLocation,
                  startIndex: propertyNode.start as number,
                  endIndex: propertyNode.end as number,
                  envs: [],
                  browsers: [],
                });
              }
            });
          }
        });
      }
    }
  });

  return groups;
}

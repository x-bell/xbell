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
import fs from 'fs-extra';
import { Visitor } from './visitor';
import { tsParserConfig, jscConfig } from './config';
import { genKeyValueProperty, genIdentifier, genStringLiteral, genEmptySpan, genVariableDeclaration } from './ast';
import { getBrowserCaseDirPath } from '../unit/path';

// function genXBellJSXKey(num: number) {
//   return '__xbell_get_jsx_' + num;
// }

// type JSXCollection = {
//   name: string;
//   ast: JSXElement
// }
// class JSXCollector extends Visitor {
//   public jsxCollections: JSXCollection[] = [];

//   visitJSXElement(n: JSXElement): JSXElement {
//     if (n.opening.name.type === 'Identifier') {
//       this.jsxCollections.push({
//         ast: JSON.parse(JSON.stringify(n)),
//         name: n.opening.name.value,
//       });
//     }
//     return n;
//   }
// }

// class NodeJSCaseCoder extends Visitor {
//   public importDeclarations = new Set<ImportDeclaration>()

//   constructor(public jsxCollections: JSXCollection[], public filename: string) {
//     super();
//   }

//   visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
//     let addComponent = false;
//     for (const specifier of n.specifiers) {
//       if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
//         if (this.jsxCollections.find(jsxCollection => specifier.local.value === jsxCollection.name)) {
//           if (!addComponent) {
//             addComponent = true;
//             const newImportDecorationNode: ImportDeclaration = JSON.parse(JSON.stringify(n));
//             newImportDecorationNode.source.value = path.join(
//               path.dirname(this.filename),
//               newImportDecorationNode.source.value
//             )
//             this.importDeclarations.add(newImportDecorationNode)
//           }
//           // @ts-ignore
//           return undefined;
//         }
//       }
//     }
//     return n;
//   }

//   // @ts-ignore
//   visitJSXElement(n: JSXElement): ObjectExpression | UnaryExpression {
//     if (n.opening.name.type === 'Identifier') {
//       const span = n.span;
//       const tagName = n.opening.name.value;
//       return {
//         type: 'ObjectExpression',
//         span: n.span,
//         properties: [
//           genKeyValueProperty(genIdentifier('type', span), genStringLiteral(tagName, span)),
//         ]
//       }
//     }

//     return {
//       type: 'UnaryExpression',
//       span: n.span,
//       operator: 'void',
//       argument: {
//         type: 'NumericLiteral',
//         span: n.span,
//         value: 0,
//       },
//     };

//   }

//   visitTsType(n: TsType): TsType {
//     return n;
//   }
// }

// class BrowserCoder extends Visitor {
//   constructor(public importDeclarations: Set<ImportDeclaration>) {
//     super();
//   }
// }

// class ImportAnalysis extends Visitor {
//   visitCallExpression(n: CallExpression): Expression {
//     if (n.callee.type === 'Import') 
//   }
// }

export function transformJSX(sourceCode: string, filename: string) {
  const program = parseSync(sourceCode, {
    ...tsParserConfig,
  });

  // const jsxCollector = new JSXCollector();

  // jsxCollector.visitProgram(program);

  // const nodeJsCaseCoder = new NodeJSCaseCoder(jsxCollector.jsxCollections, filename)
  // const nodeJsProgram = nodeJsCaseCoder.visitProgram(program)

  // const jsxCollections = jsxCollector.jsxCollections;
  // const importDeclarations = nodeJsCaseCoder.importDeclarations;

  // const browserProgram: Module = {
  //   // @ts-ignore
  //   interpreter: null,
  //   type: 'Module',
  //   span: genEmptySpan(),
  //   body: [
  //     ...Array.from(importDeclarations),
  //     ...Array.from(
  //       jsxCollections
  //     ).map((jsxCollection, idx) => genVariableDeclaration(
  //       genXBellJSXKey(idx), jsxCollection.ast
  //     )),
  //   ]
  // }
  const { code: nodeJSCode, map: nodeJSMap } = transformSync(program, {
    module: {
      type: 'es6'
    },
    jsc: jscConfig,
  });

  // const { code: browserCode, map: browserMap } = transformSync(browserProgram, {
  //   module: {
  //     type: 'commonjs'
  //   },
  //   jsc: jscConfig,
  // });


  const browserCaseDir = getBrowserCaseDirPath(filename);

  fs.ensureDirSync(browserCaseDir)
  return {
    code: nodeJSCode,
    map: nodeJSMap,
  }
}

const reservedWordsStrict = new Set([
  'implements',
  'interface',
  'let',
  'package',
  'private',
  'protected',
  'public',
  'static',
  'yield',
]);

const keywords = new Set([
  'break',
  'case',
  'catch',
  'continue',
  'debugger',
  'default',
  'do',
  'else',
  'finally',
  'for',
  'function',
  'if',
  'return',
  'switch',
  'throw',
  'try',
  'var',
  'const',
  'while',
  'with',
  'new',
  'this',
  'super',
  'class',
  'extends',
  'export',
  'import',
  'null',
  'true',
  'false',
  'in',
  'instanceof',
  'typeof',
  'void',
  'delete',
]);


 export function isReservedWord(word: string, inModule: boolean): boolean {
  return (inModule && word === 'await') || word === 'enum';
}

export function isStrictReservedWord(word: string, inModule: boolean): boolean {
  return isReservedWord(word, inModule) || reservedWordsStrict.has(word);
}

export function isKeyword(word: string) {
  return keywords.has(word);
}

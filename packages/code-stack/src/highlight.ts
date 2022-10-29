import type { Token as JSToken, JSXToken } from 'js-tokens';
import jsTokens from 'js-tokens';

import {
  isStrictReservedWord,
  isKeyword,
} from './utils'
import color from '@xbell/color';

const sometimesKeywords = new Set(['as', 'async', 'from', 'get', 'of', 'set']);

type InternalTokenType =
  | 'keyword'
  | 'capitalized'
  | 'jsxIdentifier'
  | 'punctuator'
  | 'number'
  | 'string'
  | 'regex'
  | 'comment'
  | 'invalid';

type Token = {
  type: InternalTokenType | 'uncolored';
  value: string;
};

const colorMapByType: Record<string, (str: string) => string> = {
  keyword: color.magenta,
  capitalized: color.cyan,
  jsxIdentifier: color.yellow,
  punctuator: color.yellow,
  number: color.yellow,
  string: color.green,
  regex: color.red,
  comment: color.gray,
  invalid: color.white.bgRed.bold,
};

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
const BRACKET = /^[()[\]{}]$/;


function getTokenType(
  token: JSToken | JSXToken,
): InternalTokenType | 'uncolored' {
  if (token.type === 'IdentifierName') {
    if (
      isKeyword(token.value) ||
      isStrictReservedWord(token.value, true) ||
      sometimesKeywords.has(token.value)
    ) {
      return 'keyword';
    }

    if (token.value[0] !== token.value[0].toLowerCase()) {
      return 'capitalized';
    }
  }

  if (token.type === 'Punctuator' && BRACKET.test(token.value)) {
    return 'uncolored';
  }

  if (token.type === 'Invalid' && token.value === '@') {
    return 'punctuator';
  }

  switch (token.type) {
    case 'NumericLiteral':
      return 'number';

    case 'StringLiteral':
    case 'JSXString':
    case 'NoSubstitutionTemplate':
      return 'string';

    case 'RegularExpressionLiteral':
      return 'regex';

    case 'Punctuator':
    case 'JSXPunctuator':
      return 'punctuator';

    case 'MultiLineComment':
    case 'SingleLineComment':
      return 'comment';

    case 'Invalid':
    case 'JSXInvalid':
      return 'invalid';

    case 'JSXIdentifier':
      return 'jsxIdentifier';

    default:
      return 'uncolored';
  }
};


function* tokenize(text: string): Generator<Token> {
  for (const token of jsTokens(text, { jsx: true })) {
    switch (token.type) {
      case 'TemplateHead':
        yield { type: 'string', value: token.value.slice(0, -2) };
        yield { type: 'punctuator', value: '${' };
        break;

      case 'TemplateMiddle':
        yield { type: 'punctuator', value: '}' };
        yield { type: 'string', value: token.value.slice(1, -2) };
        yield { type: 'punctuator', value: '${' };
        break;

      case 'TemplateTail':
        yield { type: 'punctuator', value: '}' };
        yield { type: 'string', value: token.value.slice(1) };
        break;

      default:
        yield {
          type: getTokenType(token),
          value: token.value,
        };
    }
  }
};

export function highlight(code: string): string {
  if (!code)  return code;

  let highlighted = '';

  for (const { type, value } of tokenize(code)) {
    const colorize = colorMapByType[type];
    if (colorize) {
      highlighted += value
        .split(NEWLINE)
        .map(str => colorize(str))
        .join('\n');
    } else {
      highlighted += value;
    }
  }

  return highlighted;
}

import color from '@xbell/color';
import { format } from '@xbell/format';
import type { ExpellMatchState } from './types';

type ColorType =
  | 'black'
  | 'red';

interface ColorText {
  color: ColorType;
  text: Array<string | ColorText>;
}

export function formatAssertionName() {
  
}

export function getMatcherMessage({
  assertionName,
  ignoreExpected,
  not,
  rejects,
  resolves
}: {
  assertionName: string;
  ignoreExpected?: boolean;
} & ExpellMatchState): string {
  return `${color.gray('expect(')}${color.red('received')}${color.gray(')')}${not ? '.not' : ''}.${assertionName}(${ignoreExpected ? '' : color.green('expected')})`;
}

export function getAssertionMessage(options: {
  received: any;
  expected: any;
  assertionName: string;
  additionalMessage?: string;
  receivedLabel?: string;
  expectedLabel?: string;
} & ExpellMatchState): string;

export function getAssertionMessage(options: {
  assertionName: string;
  receivedMessage: string;
  expectedMessage: string;
  ignoreExpected?: false;
  receivedLabel?: string;
  expectedLabel?: string;
} & ExpellMatchState): string;
export function getAssertionMessage(options: {
  received: any;
  ignoreExpected: true;
  assertionName: string;
  receivedLabel?: string;
  expectedLabel?: string;
} & ExpellMatchState): string;
export function getAssertionMessage(options: {
  assertionName: string;
  expectedMessage: string;
  ignoreExpected?: false;
  received: any;
  receivedLabel?: string;
  expectedLabel?: string;
} & ExpellMatchState): string;
export function getAssertionMessage({
  received,
  expected,
  expectedMessage,
  assertionName,
  ignoreExpected,
  additionalMessage,
  receivedMessage,
  receivedLabel = 'Received',
  expectedLabel = 'Expected',
  not,
  resolves,
  rejects,
}: {
  assertionName: string,
  received?: any,
  expectedMessage?: string;
  receivedMessage?: string;
  expected?: any,
  ignoreExpected?: boolean;
  additionalMessage?: string
  receivedLabel?: string;
  expectedLabel?: string;
} & ExpellMatchState): string {
  return [
    '',
    getMatcherMessage({ assertionName, ignoreExpected, not, rejects, resolves }),
    '',
    !ignoreExpected && `${expectedLabel}: ${color.green(expectedMessage ?? format(expected))}`,
    `${receivedLabel}: ${color.red(receivedMessage ?? format(received))}`,
    additionalMessage ? '' : undefined,
    additionalMessage
  ].filter(item => item != null).join('\n')
}


import color from '@xbell/color';
import { format } from '@xbell/format';

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
  isNot,
  ignoreExpected,
}: {
  assertionName: string;
  isNot?: boolean;
  ignoreExpected?: boolean;
}): string {
  return `${color.gray('expect(')}${color.red('received')}${color.gray(')')}${isNot ? '.not' : ''}.${assertionName}(${ignoreExpected ? '' : color.green('expected')})`;
}

export function getAssertionMessage(options: {
  received: any;
  expected: any;
  assertionName: string;
  additionalMessage?: string;
  isNot?: boolean;
  receivedLabel?: string;
  expectedLabel?: string;
}): string;

export function getAssertionMessage(options: {
  assertionName: string;
  receivedMessage: string;
  expectedMessage: string;
  ignoreExpected?: false;
  isNot?: boolean;
  receivedLabel?: string;
  expectedLabel?: string;
}): string;
export function getAssertionMessage(options: {
  received: any;
  ignoreExpected: true;
  assertionName: string;
  isNot?: boolean;
  receivedLabel?: string;
  expectedLabel?: string;
}): string;
export function getAssertionMessage(options: {
  assertionName: string;
  expectedMessage: string;
  ignoreExpected?: false;
  received: any;
  isNot?: boolean;
  receivedLabel?: string;
  expectedLabel?: string;
}): string;
export function getAssertionMessage({
  received,
  expected,
  expectedMessage,
  assertionName,
  isNot,
  ignoreExpected,
  additionalMessage,
  receivedMessage,
  receivedLabel = 'Received',
  expectedLabel = 'Expected',
}: {
  assertionName: string,
  received?: any,
  expectedMessage?: string;
  receivedMessage?: string;
  expected?: any,
  isNot?: boolean,
  ignoreExpected?: boolean;
  additionalMessage?: string
  receivedLabel?: string;
  expectedLabel?: string;
}): string {
  return [
    '',
    getMatcherMessage({ assertionName, isNot, ignoreExpected }),
    '',
    !ignoreExpected && `${expectedLabel}: ${color.green(expectedMessage ?? format(expected))}`,
    `${receivedLabel}: ${color.red(receivedMessage ?? format(received))}`,
    additionalMessage ? '' : undefined,
    additionalMessage
  ].filter(item => item != null).join('\n')
}


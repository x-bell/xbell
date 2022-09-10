import pc from 'picocolors';
import { format } from '@xbell/format';

type ColorType =
  | 'black'
  | 'red';

interface ColorText {
  color: ColorType;
  text: Array<string | ColorText>;
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
  return `${pc.magenta('AssertionError:')} ${pc.gray('expect(')}${pc.red('received')}${pc.gray(')')}${isNot ? '.not' : ''}.${assertionName}(${ignoreExpected ? '' : pc.green('expected')})`;
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
    !ignoreExpected && `${expectedLabel}: ${pc.green(expectedMessage ?? format(expected))}`,
    `${receivedLabel}: ${pc.red(receivedMessage ?? format(received))}`,
    additionalMessage
  ].filter(Boolean).join('\n')
}


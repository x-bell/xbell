import color from '@xbell/color';
import { format } from '@xbell/format';
import type { ExpectMatchState } from './types';

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
  resolves,
  matcherReceived = 'received',
  matcherExpected = 'expected'
}: {
  assertionName: string;
  ignoreExpected?: boolean;
  matcherReceived?: string;
  matcherExpected?: string;
} & ExpectMatchState): string {
  return `${color.gray('expect(')}${color.red(matcherReceived)}${color.gray(')')}${resolves ? '.resolves' : ''}${rejects ? '.rejects' : ''}${not ? '.not' : ''}.${assertionName}(${(ignoreExpected || !matcherExpected) ? '' : color.green(matcherExpected)})`;
}


// type ReceivedOptions = {
//   receivedLabel?: string;
// }

// export function getAssertionMessage(options: {
//   received: any;
//   expected: any;
//   assertionName: string;
//   additionalMessage?: string;
//   receivedLabel?: string;
//   expectedLabel?: string;
//   matcherReceived?: string;
//   matcherExpected?: string;
// } & ExpectMatchState): string;

// export function getAssertionMessage(options: {
//   assertionName: string;
//   receivedFormat: string;
//   expectedFormat: string;
//   receivedLabel?: string;
//   expectedLabel?: string;
//   matcherReceived?: string;
//   matcherExpected?: string;
// } & ExpectMatchState): string;
// export function getAssertionMessage(options: {
//   received: any;
//   ignoreExpected: true;
//   assertionName: string;
//   receivedLabel?: string;
//   expectedLabel?: string;
//   matcherReceived?: string;
//   matcherExpected?: string;
// } & ExpectMatchState): string;
// export function getAssertionMessage(options: {
//   assertionName: string;
//   expectedFormat: string;
//   ignoreExpected?: false;
//   received: any;
//   receivedLabel?: string;
//   expectedLabel?: string;
//   matcherReceived?: string;
//   matcherExpected?: string;
// } & ExpectMatchState): string;

export function getAssertionMessage({
  received,
  expected,
  expectedFormat,
  assertionName,
  ignoreExpected,
  ignoreReceived,
  additionalMessage,
  receivedFormat,
  receivedLabel = 'Received',
  expectedLabel = 'Expected',
  matcherReceived = 'received',
  not,
  resolves,
  rejects,
  matcherExpected
}: {
  assertionName: string,
  received?: any,
  expectedFormat?: string;
  receivedFormat?: string;
  expected?: any,
  ignoreExpected?: boolean;
  ignoreReceived?: boolean;
  additionalMessage?: string
  receivedLabel?: string;
  expectedLabel?: string;
  matcherReceived?: string;
  matcherExpected?: string;
} & ExpectMatchState): string {
  return [
    getMatcherMessage({ assertionName, ignoreExpected, matcherReceived, matcherExpected, not, rejects, resolves }),
    !ignoreExpected || !ignoreReceived ? '' : undefined,
    !ignoreExpected && `${expectedLabel}: ${color.green(expectedFormat ?? format(expected))}`,
    !ignoreReceived && `${receivedLabel}: ${color.red(receivedFormat ?? format(received))}`,
    additionalMessage ? '' : undefined,
    additionalMessage
  ].filter(item => item != null).join('\n')
}


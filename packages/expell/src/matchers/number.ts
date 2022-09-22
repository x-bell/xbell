import { format } from '@xbell/format';
import { defineMatcher } from '../expell';
import { getAssertionMessage } from '../message';

export const numberMatcher = defineMatcher({
  toBeLessThan(received: number | bigint, expected: number | bigint) {
    return {
      pass: received < expected,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeLessThan',
        received,
        expectedMessage: `${not ? ' not ' : ''}< ${format(expected)}`,
      }),
    }
  },
  toBeLessThanOrEqual(received: number | bigint, expected: number | bigint) {
    return {
      pass: received <= expected,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeLessThanOrEqual',
        received,
        expectedMessage: `${not ? ' not ' : ''}<= ${format(expected)}`,
      }),
    }
  },
  toBeGreaterThan(received: number | bigint, expected: number | bigint) {
    return {
      pass: received > expected,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeGreaterThan',
        received,
        expectedMessage: `${not ? ' not ' : ''}> ${format(expected)}`,
      }),
    }
  },
  toBeGreaterThanOrEqual(received: number | bigint, expected: number | bigint) {
    return {
      pass: received >= expected,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeGreaterThanOrEqual',
        received,
        expectedMessage: `${not ? ' not ' : ''}>= ${format(expected)}`,
      }),
    }
  },
  toBeCloseTo(received: number, expected: number, precision = 2) {
    let pass = false;
    let expectedDiff = 0;
    let receivedDiff = 0;

    if (received === Infinity && expected === Infinity) {
      pass = true
    }
    else if (received === -Infinity && expected === -Infinity) {
      pass = true
    } else {
      expectedDiff = 10 ** -precision / 2
      receivedDiff = Math.abs(expected - received)
      pass = receivedDiff < expectedDiff
    }

    return {
      pass,
      message: ({ not }) => getAssertionMessage({
        expected,
        assertionName: 'toBeCloseTo',
        received,
        additionalMessage: [
          `Expected difference: ${not ? 'not ' : ''}< ${expectedDiff}`,
          `Received difference: ${receivedDiff}`
        ].join('\n')
      })
    }
  }
});

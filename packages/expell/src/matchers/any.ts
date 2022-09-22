import { format } from '@xbell/format';
import { defineMatcher } from '../expell';
import { getAssertionMessage, getMatcherMessage } from '../message';
import { ExpellMatchFunction, ExpellMatchPromiseFunction } from '../types';
import { getConstructorName } from '../proto';
import { equals, iterableEquality, typeEquality, sparseArrayEquality, arrayBufferEquality } from '../equal';

interface ExpellAnyAssertion {
  // not: ExpellAssertion<T>
  toBe(expected: any): void;
  toHaveProperty(property: string | string[], value?: unknown): void;
  toBeDefined(): void;
  toBeFalsy(): void;
  toBeInstanceOf(cls: unknown): void;
  toBeNull(): void;
  toBeTruthy(): void;
  toBeUndefined(): void;
  toBeNaN(): void;
  toContain(item: unknown): void;
  toContainEqual(item: unknown): void;
  toEqual(value: unknown): void;
  toMatch(reg: RegExp | string): void;
  // todo
  toMatchObject(value: unknown): void;
  toMatchSnapshot(): void;
  toMatchInlineSnapshot(): void;
  toStrictEqual(): void;
  toThrow(): void;
  toThrowErrorMatchingSnapshot(): void;
  toThrowErrorMatchingInlineSnapshot(): void;
}

export const anyMatcher = defineMatcher({
  toBe(received: unknown, expected: unknown) {
    const pass = Object.is(received, expected);
    return {
      pass,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBe',
        received,
        expected
      })
    }
  },
  toEqual(received: unknown, expected: unknown) {
    return {
      pass: equals(received, expected, [iterableEquality]),
      message: ({ not }) => getAssertionMessage({
        assertionName: 'toEqual',
        isNot: not,
        expected,
        received,
      }),
    }
  },
  toStrictEqual(received: unknown, expected: unknown) {
    return {
      pass: equals(received, expected, [
        iterableEquality,
        typeEquality,
        sparseArrayEquality,
        arrayBufferEquality,
      ]),
      message: ({ not }) => getAssertionMessage({
        assertionName: 'toStrictEqual',
        isNot: not,
        received,
        expected,
      })
    }
  },
  toBeDefined(received: unknown) {
    return {
      pass: received !== undefined,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeDefined',
        received,
        ignoreExpected: true,
      }),
    };
  },
  toBeUndefined(received: unknown) {
    return {
      pass: received === undefined,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeUndefined',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeNull(received: unknown) {
    return {
      pass: received === null,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeNull',
        received,
        expected: null,
      }),
    }
  },
  toBeFalsy(received: unknown) {
    return {
      pass: !received,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeFalsy',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeTruthy(received: unknown) {
    return {
      pass: !!received,
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeTruthy',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeNaN(received: unknown) {
    return {
      pass: Number.isNaN(received),
      message: ({ not }) => getAssertionMessage({
        isNot: not,
        assertionName: 'toBeNaN',
        received,
        expected: NaN,
      }),
    }
  },
  toBeInstanceOf(received: unknown, expected: Function) {
    return {
      pass: received instanceof expected,
      message: ({ not }) => {
        const isPrimitiveType = Object(received) !== received;
        const isNoPrototype = Object.getPrototypeOf(received) === null;
        if (isPrimitiveType || isNoPrototype) {
          return [
            '',
            getMatcherMessage({ assertionName: 'toBeInstanceOf', isNot: not }),
            '',

          ].join('\n')
        }
        const receivedConstructorName = getConstructorName({
          value: received,
          isConstructor: false,
        });
        const expectedConstructorName = getConstructorName({
          value: expected,
          isConstructor: true,
        });
        return getAssertionMessage({
          assertionName: 'toBeInstanceOf',
          isNot: not,
          receivedMessage: receivedConstructorName ?? format(received),
          expectedMessage: expectedConstructorName ?? format(expected),
          receivedLabel: receivedConstructorName ? 'Received Constructor' : 'Received Value',
          expectedLabel: receivedConstructorName ? 'Expected Constructor' : 'Expected Value',
        });
      }
    }
  },
});

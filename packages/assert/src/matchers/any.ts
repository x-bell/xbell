import { format } from '@xbell/format';
import { defineMatcher } from '../expect';
import { getAssertionMessage, getMatcherMessage } from '../message';
import { getConstructorName } from '../proto';
import { equals, iterableEquality, typeEquality, sparseArrayEquality, arrayBufferEquality } from '../equal';

interface ExpectAnyAssertion {
  // not: ExpectAssertion<T>
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
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBe',
        received,
        expectedFormat: state.not ? `not ${format(received)}` : format(received),
        expected
      })
    }
  },
  toEqual(received: unknown, expected: unknown) {
    return {
      pass: equals(received, expected, [iterableEquality]),
      message: (state) => getAssertionMessage({
        assertionName: 'toEqual',
        expected,
        received,
        ...state,
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
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toStrictEqual',
        received,
        expected,
      })
    }
  },
  toBeDefined(received: unknown) {
    return {
      pass: received !== undefined,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeDefined',
        received,
        ignoreExpected: true,
      }),
    };
  },
  toBeUndefined(received: unknown) {
    return {
      pass: received === undefined,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeUndefined',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeNull(received: unknown) {
    return {
      pass: received === null,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeNull',
        received,
        expected: null,
      }),
    }
  },
  toBeFalsy(received: unknown) {
    return {
      pass: !received,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeFalsy',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeTruthy(received: unknown) {
    return {
      pass: !!received,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeTruthy',
        received,
        ignoreExpected: true,
      }),
    }
  },
  toBeNaN(received: unknown) {
    return {
      pass: Number.isNaN(received),
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBeNaN',
        received,
        expected: NaN,
      }),
    }
  },
  toBeInstanceOf(received: unknown, expected: Function) {
    return {
      pass: received instanceof expected,
      message: (state) => {
        const isPrimitiveType = Object(received) !== received;
        const isNoPrototype = Object.getPrototypeOf(received) === null;
        if (isPrimitiveType || isNoPrototype) {
          return [
            '',
            getMatcherMessage({ assertionName: 'toBeInstanceOf', ...state, }),
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
          ...state,
          receivedFormat: receivedConstructorName ?? format(received),
          expectedFormat: expectedConstructorName ?? format(expected),
          receivedLabel: receivedConstructorName ? 'Received Constructor' : 'Received Value',
          expectedLabel: receivedConstructorName ? 'Expected Constructor' : 'Expected Value',
        });
      }
    }
  },
  toThrow(received: unknown, expected?: string | RegExp | Error) {
    let message;
    return {
      pass: (state) => {
        let err: any;
        let isThrow = false;
        if (typeof received === 'function') {
          try {
            received();
          } catch (error) {
            err = error;
            isThrow = true;
          }
        } else if (state.rejects) {
          err = received;
        }

        if (!isThrow && !err) {
          return false;
        }

        if (typeof expected === 'undefined') {
          return isThrow || err instanceof Error;
        } else if (typeof expected === 'string') {
          return err?.message === expected;
        } else if (expected instanceof RegExp) {
          return expected.test(err?.message)
        } else if (expected instanceof Error) {
          return expected.message === err?.message;
        }

        return true;
      },
      message: ({ not }) => {
        return 'toThrow Error';
      }
    }
  }
});

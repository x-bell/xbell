import { format } from '@xbell/format';
import color from '@xbell/color';
import { defineMatcher } from '../expect';
import { getAssertionMessage, getMatcherMessage } from '../message';
import { getConstructorName } from '../proto';
import { equals, iterableEquality, typeEquality, sparseArrayEquality, arrayBufferEquality } from '../equal';
import { isIterable } from '../validate';

export const anyMatcher = defineMatcher({
  toBe(received: unknown, expected: unknown) {
    const pass = Object.is(received, expected);
    return {
      pass,
      message: (state) => getAssertionMessage({
        ...state,
        assertionName: 'toBe',
        received,
        expectedFormat: state.not ? `not ${format(expected)}` : format(expected),
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
  toContain(received: unknown, expected: unknown) {
    if (!isIterable(received)) {
      return {
        pass: false,
        message: state => getAssertionMessage({
          ...state,
          assertionName: 'toContain',
          ignoreExpected: true,
          ignoreReceived: true,
          additionalMessage: `${color.red('received')} value must be iterable`,
        }),
      }
    }

    let pass = false;

    for (const item of received) {
      if (item === expected) {
        pass = true;
        break;
      }
    }

    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toContain',
        expectedLabel: 'Expected value',
        receivedLabel: 'Received array',
        received,
        expected,
      }),
    };
  },
  toContainEqual(received: unknown, expected: unknown) {
    if (!isIterable(received)) {
      return {
        pass: false,
        message: state => getAssertionMessage({
          ...state,
          assertionName: 'toContainEqual',
          ignoreExpected: true,
          ignoreReceived: true,
          additionalMessage: `${color.red('received')} value must be iterable`,
        }),
      }
    }
    let pass = false;

    for (const item of received) {
      if (equals(item, expected, [iterableEquality])) {
        pass = true;
        break;
      }
    }

    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toContainEqual',
        expectedLabel: 'Expected value',
        receivedLabel: 'Received array',
        received,
        expected,
      }),
    };
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
  toHaveLength(received: any, length: number) {
    return {
      pass: received?.length === length,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toHaveLength',
        expectedLabel: 'Expected length',
        receivedLabel: 'Received length',
        received: received?.length,
        expected: length,
      })
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
  toHaveProperty(received: unknown, ...args: [keyPath: string | string[], value?: any]) {
    let [keyPath, value] = args;
    if (typeof keyPath !== 'string' && !Array.isArray(keyPath)) {
      return {
        pass: false,
        message: state => getAssertionMessage({
          ...state,
          assertionName: 'toHaveProperty',
          ignoreExpected: true,
          ignoreReceived: true,
          additionalMessage: [
            `${color.green('expected')} path must be a string or array`,
            '',
            `Expected has type:  ${typeof keyPath}`,
            `Expected has value: ${format(keyPath)}`,
          ].join('\n')
        }),
      };
    }

    const fixKey = (key: unknown) => String(key).replace(/\[(\d+)\]/g, '.$1');
    const keyPathStr = Array.isArray(keyPath) ? keyPath.map(item => fixKey(item)).join('.') : fixKey('key')
    const paths = keyPathStr.split('.');
    let result: any = received
    const lastKey = paths.pop();
    const receivedPath: string[] = [];
    for (const key of paths) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key]
        receivedPath.push(key);
      } else {
        break;
      }
    }
    return {
      pass: lastKey != null &&
        Object.prototype.hasOwnProperty.call(result, lastKey) &&
        (args.length < 2 || equals(result[lastKey], value, [iterableEquality])),
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toHaveProperty',
        expectedLabel: 'Expected path',
        expectedFormat: keyPathStr,
        receivedLabel: 'Received path',
        receivedFormat: receivedPath.join('.'),
        matcherExpected: 'matcherExpected',
      })
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
  },
});

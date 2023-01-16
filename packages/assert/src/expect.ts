import type { ConditionType } from './types/utils'
import type { ExpectMatchObject, Expect, ExpectMatchResult, ExpectMatchState } from './types/expect';
import color from '@xbell/color';
import { format } from '@xbell/format';
import { isPromise, checkRejects, AssertionError, getPromiseValue, toMatch } from './validate';
import { getAssertionMessage } from './message';


export function createExpect<MatchObject extends ExpectMatchObject, Type = any, DefaultObject = {}>(matchObject: MatchObject): Expect<MatchObject, Type, DefaultObject> {
  const expect: Omit<Expect<MatchObject, Type, DefaultObject>, 'extend'> = <Received>(received: Received) => {
    const state: ExpectMatchState = {
      not: false,
      resolves: false,
      rejects: false,
    };

    const proxy = new Proxy({}, {
      get(target, propKey, receiver) {
        if (propKey === 'not') {
          state.not = !state.not;
          return receiver;
        }

        if (propKey === 'resolves') {
          state.resolves = !state.resolves;
          return receiver;
        }

        if (propKey === 'rejects') {
          state.rejects = !state.rejects;
          return receiver;
        }

        if (typeof matchObject[propKey as string] === 'function') {
          return (...args: any[]) => {
            // rejects
            if (state.rejects) {
              const { isValid, promise } = checkRejects(received);
              if (!isValid) {
                const msg = getAssertionMessage({
                  ...state,
                  assertionName: propKey.toString(),
                  ignoreExpected: true,
                  ignoreReceived: true,
                  additionalMessage: [
                    `${color.red('received')} value must be a promise or a function returning a promise`,
                    '',
                    `Received has type:  ${typeof received}`,
                    `Received has value: ${color.red(format(received))}`,
                  ].join('\n')
                });
                // NOTE: throw
                throw new AssertionError(msg);
              }

              return getPromiseValue(promise).then(({ isThrow, result, reason }) => {
                // handle resolve
                if (!isThrow) {
                  const msg = getAssertionMessage({
                    ...state,
                    assertionName: propKey.toString(),
                    ignoreExpected: true,
                    ignoreReceived: true,
                    additionalMessage: [
                      'Received promise resolved instead of rejected',
                      `Resolved to value: ${color.red(result)}`,
                    ].join('\n')
                  });

                  throw new AssertionError(msg);
                }
                return toMatch({
                  matchObject,
                  propKey,
                  received: reason,
                  args,
                  state,
                });
              });
            }
            // resolves
            if (state.resolves) {
              if (!isPromise(received)) {
                const msg = getAssertionMessage({
                  ...state,
                  assertionName: propKey.toString(),
                  ignoreExpected: true,
                  ignoreReceived: true,
                  additionalMessage: [
                    `${color.red('received')} value must be a promise`,
                    '',
                    `Received has type:  ${typeof received}`,
                    `Received has value: ${color.red(format(received))}`,
                  ].join('\n'),
                });
                throw new AssertionError(msg);
              }

              return getPromiseValue(received).then(({ isThrow, result, reason }) => {
                if (isThrow) {
                  const msg = getAssertionMessage({
                    ...state,
                    assertionName: propKey.toString(),
                    ignoreExpected: true,
                    ignoreReceived: true,
                    additionalMessage: [
                      'Received promise rejected instead of resolved',
                      `Rejected to value: ${color.red(reason)}`,
                    ].join('\n')
                  });

                  throw new AssertionError(msg);
                }

                return toMatch({
                  matchObject,
                  propKey,
                  received: result,
                  args,
                  state,
                });
              });
            }

            return toMatch({
              received,
              matchObject,
              propKey,
              state,
              args,
            });
          };
        }
      },
    });
    return proxy;
  }

  const extend: Expect<MatchObject, Type, DefaultObject>['extend'] =
    <ExtendMatchObject extends ExpectMatchObject, ExtendType>(extendMatchObject: ExtendMatchObject): Expect<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>> => {
    return createExpect<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>>({
      ...matchObject,
      ...extendMatchObject,
    });
  };

  (expect as Expect<MatchObject, Type, DefaultObject>).extend = extend;

  return expect as Expect<MatchObject, Type, DefaultObject>;
}

export function defineMatcher<K extends ExpectMatchObject>(matchObject: K): K {
  return matchObject;
}

// const stringMatcher = defineMatcher({
//   stringHaveLength<R extends any[]>(received: R, length: R) {
//     return {
//       pass: true,
//       message: () =>  `Received: ${received.length} \n` + `Expected: ${length}`,
//     }
//   },
//   stringEqualAsync<R>(received: R, expected: R) {
//     return Promise.resolve({
//       pass: received === expected,
//       message: () => `Received: ${received} \n` + `Expected: ${expected}`,
//     })
//   }
// })

// const numberMatcher = defineMatcher({
//   async numberLessThan(received: number, target: number) {
//     return {
//       pass: received < target,
//       message: () => `Received: ${received} \n` + `Expected: ${target} or less`,
//     }
//   },
//   aF(a) {
//     return (state) => {
//       return {
//         pass: true,
//         message: () => '',
//       }
//     }
//   },
//   aFP(a) {
//     return async (state) => {
//       return {
//         pass: true,
//         message: () => '',
//       }
//     }
//   }
// });

// await expect.extend(numberMatcher)('').aF();
// await expect.extend(numberMatcher)('').resolves.aF();
// await expect.extend(numberMatcher)('').rejects.aFP();

// const expect = createExpect<typeof stringMatcher, string>(stringMatcher)
//   .extend<typeof numberMatcher, number>(numberMatcher);

// const ret = expect('123').stringHaveLength('123', 123)
// const promiseRet = expect('abc').stringEqualAsync(2)

// const promiseRetWithPromiseArg = expect(Promise.resolve(2)).resolves.numberLessThan(3)


// console.log('rest', ret, promiseRet, promiseRetWithPromiseArg);


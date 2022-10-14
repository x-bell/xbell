import type { ConditionType } from './types/utils'
import type { ExpellMatchObject, Expell, ExpellMatchResult, ExpellMatchState } from './types';



// interface ExpellFunctionAssertion {
//   // functions
//   toHaveBeenCalled(): void;
//   toHaveBeenCalledTimes(times: number): void;
//   toHaveBeenCalledWith(arg1, arg2, ...args): void;
//   toHaveBeenLastCalledWith(arg1, arg2, ...args): void;
//   toHaveBeenNthCalledWith(nthCall: number, arg2, ...args): void;
//   toHaveReturned(): void;
//   toHaveReturnedTimes(): void;
//   toHaveReturnedWith(value: unknown): void;
//   toHaveLastReturnedWith(value: unknown): void;
//   toHaveNthReturnedWith(nthCall: number, value: unknown): void;
// }


interface ExpellArrayAssertion {
  // array
  toHaveLength(length: number): void;
}

interface ExpellAssertionABC {
  // not: ExpellAssertion<T>
  toBe(expected: any): void;
  toHaveProperty(property: string | string[], value?: unknown): void;
  toBeCloseTo(num: number, numDigits: number): void;
  toBeDefined(): void;
  toBeFalsy(): void;
  toBeGreaterThan(num: number | bigint): void;
  toBeGreaterThanOrEqual(num: number | bigint): void;
  toBeLessThan(num: number | bigint): void;
  toBeLessThanOrEqual(num: number | bigint): void;
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

function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
  if (v && typeof (v as any).then === 'function') {
    return true;
  }

  return false;
}


export function createExpell<MatchObject extends ExpellMatchObject, Type = any, DefaultObject = {}>(matchObject: MatchObject): Expell<MatchObject, Type, DefaultObject> {
  const expell: Omit<Expell<MatchObject, Type, DefaultObject>, 'extend'> = <Received>(received: Received) => {
    const state: ExpellMatchState = {
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
            const innerRet: ExpellMatchResult | Promise<ExpellMatchResult> = state.resolves
              ? Promise.resolve(received).then(res => Reflect.apply(matchObject[propKey as string], state, [res, ...args]))
              : state.rejects
                ? Promise.resolve(received).catch(res => Reflect.apply(matchObject[propKey as string], state, [res, ...args]))
                : Reflect.apply(matchObject[propKey as string], state, [received, ...args])

            if (isPromise(innerRet)) {
              return innerRet.then((ret) => {
                const rawPass = typeof ret.pass === 'function' ? ret.pass(state) : ret.pass;
                const pass = state.not ? !rawPass : rawPass;
                if (!pass) {
                  const err = new Error(ret.message(state));
                  err.name = 'AssertionError';
                  return Promise.reject(err);
                }
              })
            } else {
              const rawPass = typeof innerRet.pass === 'function' ? innerRet.pass(state) : innerRet.pass;
              const pass = state.not ? !rawPass : rawPass;

              if (!pass) {
                const msg = innerRet.message(state);
                const err = new Error(msg)
                err.name = 'AssertionError';
                throw err;
              }
            }
          };
        }
      },
    });
    return proxy;
  }

  const extend: Expell<MatchObject, Type, DefaultObject>['extend'] = <ExtendMatchObject extends ExpellMatchObject, ExtendType>(extendMatchObject: ExtendMatchObject): Expell<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>> => {
    return createExpell<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>>({
      ...matchObject,
      ...extendMatchObject,
    });
  };

  (expell as Expell<MatchObject, Type, DefaultObject>).extend = extend;

  return expell as Expell<MatchObject, Type, DefaultObject>;
}

export function defineMatcher<K extends ExpellMatchObject>(matchObject: K): K {
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
//   numberLessThan(received: number, target: number) {
//     return {
//       pass: received < target,
//       message: () => `Received: ${received} \n` + `Expected: ${target} or less`,
//     }
//   }
// })

// const expell = createExpell<typeof stringMatcher, string>(stringMatcher)
//   .extend<typeof numberMatcher, number>(numberMatcher);

// const ret = expell('123').stringHaveLength('123', 123)
// const promiseRet = expell('abc').stringEqualAsync(2)

// const promiseRetWithPromiseArg = expell(Promise.resolve(2)).resolves.numberLessThan(3)


// console.log('rest', ret, promiseRet, promiseRetWithPromiseArg);


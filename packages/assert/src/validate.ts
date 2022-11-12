import { ExpectMatchObject, ExpectMatchState, ExpectMatchResult } from "./types";
import debug from 'debug';

const debugValid = debug('xbell:valid');
export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// export class MatcherError extends AssertionError {}

export function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
  if (v && typeof (v as any).then === 'function') {
    return true;
  }

  return false;
}

export function checkRejects(received: any) {
  const isFunction = typeof received === 'function';
  if (isFunction) {
    const returnValue = received();
    const isValid = isPromise(returnValue);
    return {
      isFunction: true,
      isValid: isValid,
      promise: returnValue,
    }
  } else {
    return {
      isFunction: false,
      isValid: isPromise(received),
      promise: received,
    };
  }
}

export async function getPromiseValue(promise: Promise<any>) {
  let result;
  let reason;
  let isThrow = false;
  await promise
  .then((ret) => {
    result = ret;
  })
  .catch((error) => {
    isThrow = true;
    reason = error;
  });

  return {
    isThrow,
    reason,
    result,
  };
}


function handleResult(ret: ExpectMatchResult, state: ExpectMatchState) {
  const rawPass = typeof ret.pass === 'function' ? ret.pass(state) : ret.pass;
  const handlePass = (rawPass: boolean) => {
    const pass = state.not ? !rawPass : rawPass;
    if (!pass) {
      const err = new AssertionError(ret.message(state));
      throw err;
    }
  }
  if (isPromise(rawPass)) {
    return rawPass.then(handlePass);
  }
  return handlePass(rawPass);
}

export function toMatch({
  received,
  matchObject,
  propKey,
  state,
  args
}: {
  received: any;
  matchObject: ExpectMatchObject;
  state: ExpectMatchState;
  propKey: string | symbol;
  args: any[];
}) {
  const ret: Promise<ExpectMatchResult> | ExpectMatchResult = Reflect.apply(matchObject[propKey as string], state, [received, ...args])
  debugValid('toMatch', propKey, state, received, args);
  return isPromise(ret) ? ret.then(r => handleResult(r, state)) : handleResult(ret, state);
}


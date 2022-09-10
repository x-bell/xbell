// import type { ExpellMatchPromiseFunction, ExpellMatchFunction  } from '../types';
import type { ExpellSpy } from '../spy';
import { defineMatcher } from '../expell';

// interface ExpellFunctionAssertion {
//   // functions
//   toHaveBeenCalled(): any;
//   toHaveBeenCalledTimes(times: number): any;
//   toHaveBeenCalledWith(arg1, arg2, ...args): any;
//   toHaveBeenLastCalledWith(arg1, arg2, ...args): any;
//   toHaveBeenNthCalledWith(nthCall: number, arg2, ...args): any;
//   toHaveReturned(): any;
//   toHaveReturnedTimes(): any;
//   toHaveReturnedWith(value: unknown): any;
//   toHaveLastReturnedWith(value: unknown): any;
//   toHaveNthReturnedWith(nthCall: number, value: unknown): any;
// }

export const spyMatcher = defineMatcher({
  toHaveBeenCalled<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>) {
    return {
      pass: received.calls.length > 0,
      message: () => '',
    }
  },
  toHaveBeenCalledTimes<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, times: number) {
    return {
      pass: received.calls.length === times,
      message: () => ''
    }
  },
  toHaveBeenCalledWith<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, ...expectedArgs: Args) {
    const actualArgs = received.calls[0];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
        // TODO: need to equal?
        (isSameLength && actualArgs.every((actualArg, index) => actualArg === expectedArgs[index])),
      message: () => '',
    }
  },
  toHaveBeenLastCalledWith<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, ...expectedArgs: Args) {
    const actualArgs = received.calls[received.calls.length - 1];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
      // TODO: need to equal?
      (isSameLength && actualArgs.every((actualArg, index) => actualArg === expectedArgs[index])),
      message: () => '',
    }
  },
  toHaveBeenNthCalledWith<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, nthCall: number, ...expectedArgs: Args) {
    const actualArgs = received.calls[nthCall];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
      // TODO: need to equal?
      (isSameLength && actualArgs.every((actualArg, index) => actualArg === expectedArgs[index])),
      message: () => ''
    }
  },
  toHaveReturned<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>) {
    return {
      pass: received.results[0]?.value != undefined,
      message: () => '',
    }
  },
  toHaveReturnedTimes<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, times: number) {
    return {
      pass: !!received.results.map(item => item.value).slice(0, 2),
      message: () => ''
    }
  },
  toHaveReturnedWith<Args extends any[], ReturnType>(received: ExpellSpy<Args, ReturnType>, times: number) {
    return {
      pass: true,
      message: () => ''
    }
  },
  toHaveLastReturnedWith(value: unknown) {
    return {
      pass: true,
      message: () => ''
    }
  },
  toHaveNthReturnedWith(nthCall: number, value: unknown) {
    return {
      pass: true,
      message: () => ''
    }
  }
});

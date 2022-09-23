// import type { ExpellMatchPromiseFunction, ExpellMatchFunction  } from '../types';
import type { ExpellSpy } from '../spy';
import { defineMatcher } from '../expell';
import { getAssertionMessage } from '../message';

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
  toHaveBeenCalled(received: ExpellSpy) {
    return {
      pass: received.calls.length > 0,
      message: (state) => getAssertionMessage({
        assertionName: 'toHaveBeenCalled',
        expectedLabel: 'Expected number of calls',
        receivedLabel: 'Received number of calls',
        expected: 0,
        received: received.calls.length,
        ...state,
      }),
    }
  },
  toHaveBeenCalledTimes(received: ExpellSpy, times: number) {
    return {
      pass: received.calls.length === times,
      message: ({ not }) => ''
    }
  },
  toHaveBeenCalledWith(received: ExpellSpy, ...expectedArgs: any[]) {
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
  toHaveBeenLastCalledWith(received: ExpellSpy, ...expectedArgs: any[]) {
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
  toHaveBeenNthCalledWith(received: ExpellSpy, nthCall: number, ...expectedArgs: any[]) {
    const actualArgs = received.calls[nthCall];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
      // TODO: need to equal?
      (isSameLength && actualArgs.every((actualArg, index) => actualArg === expectedArgs[index])),
      message: ({ not }) => ''
    }
  },
  toHaveReturned(received: ExpellSpy) {
    return {
      pass: received.results[0]?.value != undefined,
      message: ({ not }) => '',
    }
  },
  toHaveReturnedTimes(received: ExpellSpy, times: number) {
    return {
      pass: !!received.results.map(item => item.value).slice(0, 2),
      message: ({ not }) => ''
    }
  },
  toHaveReturnedWith(received, times: number) {
    return {
      pass: true,
      message: ({ not }) => ''
    }
  },
  toHaveLastReturnedWith(value: unknown) {
    return {
      pass: true,
      message: ({ not }) => ''
    }
  },
  toHaveNthReturnedWith(nthCall: number, value: unknown) {
    return {
      pass: true,
      message: () => ''
    }
  }
});

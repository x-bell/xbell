// import type { ExpellMatchPromiseFunction, ExpellMatchFunction  } from '../types';
import type { Mock } from '../spy';
import { defineMatcher } from '../expell';
import { getAssertionMessage } from '../message';
import { equals, iterableEquality } from '../equal';

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
  toHaveBeenCalled(received: Mock) {
    return {
      pass: received.calls.length > 0,
      message: (state) => getAssertionMessage({
        assertionName: 'toHaveBeenCalled',
        expectedLabel: 'Expected number of calls',
        receivedLabel: 'Received number of calls',
        matcherReceived: 'fn()',
        expectedFormat: state.not ? '0' : '>= 1',
        matcherExpected: '',
        received: received.calls.length,
        ...state,
      }),
    }
  },
  toHaveBeenCalledTimes(received: Mock, times: number) {
    return {
      pass: received?.calls?.length === times,
      message: (state) => getAssertionMessage({
        assertionName: 'toHaveBeenCalledTimes',
        expectedLabel: 'Expected number of calls',
        receivedLabel: 'Received number of calls',
        matcherReceived: 'fn()',
        expectedFormat: state.not ? `!= ${times}` : String(times),
        matcherExpected: '',
        received: received?.calls?.length,
        ...state,
      })
    }
  },
  toHaveBeenCalledWith(received: Mock, ...expectedArgs: any[]) {
    const actualArgs = received.calls[0];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
        (isSameLength && actualArgs.every((actualArg, index) => equals(actualArg, expectedArgs[index], [iterableEquality]))),
      message: () => 'Not equal',
    }
  },
  toHaveBeenLastCalledWith(received: Mock, ...expectedArgs: any[]) {
    const actualArgs = received.calls[received.calls.length - 1];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
      (isSameLength && actualArgs.every((actualArg, index) => equals(actualArg, expectedArgs[index], [iterableEquality]))),
      message: () => 'Not equal',
    }
  },
  toHaveBeenNthCalledWith(received: Mock, nthCall: number, ...expectedArgs: any[]) {
    const actualArgs = received.calls[nthCall - 1];
    const isSameLength = expectedArgs.length === actualArgs.length;
    const isAllEmpty = !expectedArgs.length && !actualArgs.length;
    return {
      pass: isAllEmpty ||
      // TODO: need to equal?
      (isSameLength && actualArgs.every((actualArg, index) => equals(actualArg, expectedArgs[index], [iterableEquality]))),
      message: ({ not }) => 'Not equal'
    }
  },
  toHaveReturned(received: Mock) {
    return {
      pass: received.results[0]?.value != undefined,
      message: ({ not }) => '',
    }
  },
  toHaveReturnedTimes(received: Mock, times: number) {
    return {
      pass: !!received.results.map(item => item.value).slice(0, 2),
      message: ({ not }) => ''
    }
  },
  toHaveReturnedWith(received: Mock, returnValue: any) {

    if (!received.results[0]) {
      return {
        pass: false,
        message: () => 'The function No call',
      }
    }

    const { value, type } = received.results[0];

    if (type === 'throw') {
      return {
        pass: false,
        message: () => 'The function throw error',
      };
    }

    return {
      pass:  equals(value, returnValue, [iterableEquality]),
      message: ({ not }) => 'Not equal'
    }
  },
  toHaveLastReturnedWith(received: Mock, returnValue: any) {
    if (!received.results[0]) {
      return {
        pass: false,
        message: () => 'The function No call',
      };
    }

    const { value, type } = received.results[received.length - 1];

    if (type === 'throw') {
      return {
        pass: false,
        message: () => 'The function throw error',
      };
    }

    return {
      pass: equals(value, returnValue, [iterableEquality]),
      message: ({ not }) => 'Not equal'
    }
  },
  toHaveNthReturnedWith(received: Mock, nthCall: number, returnValue: any) {
    if (received.length < nthCall) {
      return {
        pass: false,
        message: () => `The function is called only ${received.length}`,
      };
    }

    const { value, type } = received.results[nthCall - 1];

    if (type === 'throw') {
      return {
        pass: false,
        message: () => `The ${nthCall} call to the function was thrown error`,
      };
    }

    return {
      pass: equals(value, returnValue, [iterableEquality]),
      message: () => 'Not Equal'
    }
  }
});

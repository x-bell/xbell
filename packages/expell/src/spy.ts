
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

export type ExpellSpy<Arg extends any[] = any[], ReturnType = any> = {
  (...args: Arg): ReturnType
} & ExpellSpyState<Arg, ReturnType>

interface ExpellSpyState<Arg extends any[], ReturnType> {
  calls: Arg[];
  results: {
    type: 'return' | 'throw'
    value: ReturnType | unknown
  }[];
}

export const spy = <Args extends any[], ReturnType>(callback: (...args: Args) => ReturnType = ((n => n) as (...args: any[]) => any)): ExpellSpy<Args, ReturnType> => {
  const handler: ExpellSpy<Args, ReturnType> = function handler(...args: Args) {
    handler.calls.push(args);
    try {
      const ret = callback(...args);
      handler.results.push({
        type: 'return',
        value: ret,
      });
      return ret;
    } catch (error) {
      handler.results.push({
        type: 'throw',
        value: error,
      })
      throw error;
    }
  }

  handler.calls = [];
  handler.results = [];

  return handler;
}

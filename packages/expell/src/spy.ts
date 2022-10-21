
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

export type Mock<Args extends any[] = any[], R = any> = {
  (...args: Args): R
} & SpyState<Args, R> & {
  _isMockFunction: true;
  _origin(...args: Args): R;
  mockReturnValue(value: R): Mock<Args, R>;
  mockImplementation(impl: (...args: Args) => R): Mock<Args, R>;
};

interface SpyState<Arg extends any[], ReturnType> {
  calls: Arg[];
  results: {
    type: 'return' | 'throw'
    value: ReturnType | unknown
  }[];
}

export const spy = <T extends (...args: any[]) => any>(callback: ((...args: Parameters<T>) => ReturnType<T>) = ((n => n) as (...args: any[]) => any)): Mock<Parameters<T>, ReturnType<T>> => {
  const origin = callback;
  const handler: Mock<Parameters<T>, ReturnType<T>> = function handler(...args: Parameters<T>) {
    handler.calls.push(args);
    try {
      const ret = origin(...args);
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

  handler.mockReturnValue = (v) => {
    return spy((...args: Parameters<T>) => v);
  };

  handler.mockImplementation = ((impl: T) => {
    return spy(impl);
  });

  handler._isMockFunction = true;
  handler._origin = origin;

  return handler;
}

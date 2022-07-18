export type PromiseReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? Promise<R>
  : any;

export type BrowserArg<A> = A extends (...args: any) => any
  ? (...args: Parameters<A>) => PromiseReturnType<A>
  : A extends object
  ? { [Key in keyof A]: BrowserArg<A[Key]> }
  : A;

export type BrowserFunction<A, R> = (v: BrowserArg<A>) => R | Promise<R>;


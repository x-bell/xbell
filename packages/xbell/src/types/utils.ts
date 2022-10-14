
export type ValueOf<T> = T[keyof T]

export type Awaitable<T> = PromiseLike<T> | T;

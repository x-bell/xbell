import { Context } from './context'
import { container } from './container'
import { sleep } from '../utils/index';

type NextFunction = () => Promise<any>;

export type CreateDecorateorCallback = (ctx: Context, next: NextFunction, ...args: any[]) => void;

export function createDecoratorImpl(callback: CreateDecorateorCallback): (...parameters: any[]) => any;
export function createDecoratorImpl<T1>(callback: CreateDecorateorCallback): (arg1: T1) => any;
export function createDecoratorImpl<T1, T2>(callback: CreateDecorateorCallback): (arg1: T1, arg2: T2) => any;

export function createDecoratorImpl(callback: CreateDecorateorCallback): (...parameters: any[]) => any {
  return (...parameters) => (target: any, propertyKey: any) => {
    const isClassDecorator = target?.constructor === Function;
    if (isClassDecorator) {
      container.addCustomClassDecorator(target, callback, parameters);
    } {
      container.addCustomMethodDecorator(target.constructor, propertyKey, callback, parameters)
    }
  }
}


export const Sleep = createDecoratorImpl<number>(async (ctx, next, timeout) => {
  await next()
  await sleep(timeout)
});

interface CreateDecoratorOptions<T> {
  before?(ctx: Context, v: T): Promise<void> | void;
  after?(ctx: Context, v: T): Promise<void> | void;
}
export function defineDecorator<T>({ before, after }: CreateDecoratorOptions<T>) {
  return createDecoratorImpl<T>(async (ctx, next, options: T) => {
    if (typeof before === 'function') await before(ctx, options);

    await next();

    if (typeof after === 'function') await after(ctx, options);
  })
}

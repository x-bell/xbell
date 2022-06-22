import { Context } from './context'
import { container } from './container'
import { sleep } from '../utils';

type NextFunction = () => Promise<any>;

export type CreateDecorateorCallback = (ctx: Context, next: NextFunction, ...args: any[]) => void;

export function createDecorator(callback: CreateDecorateorCallback): (...parameters: any[]) => any;
export function createDecorator<T1>(callback: CreateDecorateorCallback): (arg1: T1) => any;
export function createDecorator<T1, T2>(callback: CreateDecorateorCallback): (arg1: T1, arg2: T2) => any;

export function createDecorator(callback: CreateDecorateorCallback): (...parameters: any[]) => any {
  return (...parameters) => (target: any, propertyKey: any) => {
    const isClassDecorator = target?.constructor === Function;
    if (isClassDecorator) {
      container.addCustomClassDecorator(target, callback, parameters);
    } {
      container.addCustomMethodDecorator(target.constructor, propertyKey, callback, parameters)
    }
  }
}


export const Sleep = createDecorator<number>(async (ctx, next, timeout) => {
  await next()
  await sleep(timeout)
});

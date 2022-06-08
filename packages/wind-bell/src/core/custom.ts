import { Context } from './context'
import { container } from './container'

type NextFunction = () => Promise<any>;

export type CreateDecorateorCallback = (ctx: Context, next: NextFunction) => void;

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

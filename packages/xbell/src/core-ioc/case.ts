import { MetaDataType } from '../constants/index';
import { container } from './container';
import { PropertyKey } from '../types/index';

export function Group(value: string): ClassDecorator {
  return (target) => {
    container.addGroup(value, target);
  };
}

export function Case(caseName?: string): PropertyDecorator {
  return (target, methodKey: PropertyKey) => {
    container.addCase(caseName || methodKey, target, methodKey);
  };
}

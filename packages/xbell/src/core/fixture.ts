import { genParameterDecorator } from '../utils';
import { ParameterType } from '../constants';
// TODO:
export function Fixture(): MethodDecorator {
  return (target, propertyKey) => {
  };
}

Fixture.Param = genParameterDecorator(ParameterType.Fixture);

import { genParameterDecorator } from '../utils/index';
import { ParameterType } from '../constants/index';
// TODO:
export function Fixture(): MethodDecorator {
  return (target, propertyKey) => {
  };
}

Fixture.Param = genParameterDecorator(ParameterType.Fixture);

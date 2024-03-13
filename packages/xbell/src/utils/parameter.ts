import { MetaDataType, ParameterType } from '../constants/index'
import { IParameter } from '../types/index'

export function genParameterDecorator(parameterType: ParameterType): () => ParameterDecorator {
  return () => {
    return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
      const types: IParameter[] = Reflect.getMetadata(MetaDataType.Parameter, target, propertyKey!) || []
      types.push({
        index: parameterIndex,
        type: parameterType,
      })
      Reflect.defineMetadata(MetaDataType.Parameter, types, target, propertyKey!)
    }
  }
}


export function getParameters(target: Object, methodKey: symbol | string): IParameter[] {
  return Reflect.getMetadata(MetaDataType.Parameter, target, methodKey) || []
}

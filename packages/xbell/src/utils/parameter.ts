import { MetaDataType, ParameterType } from '../constants'
import { IParameter } from '../types'

export function genParameterDecorator(parameterType: ParameterType): () => ParameterDecorator {
  return () => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
      const types: IParameter[] = Reflect.getMetadata(MetaDataType.Parameter, target, propertyKey) || []
      types.push({
        index: parameterIndex,
        type: parameterType,
      })
      Reflect.defineMetadata(MetaDataType.Parameter, types, target, propertyKey)
    }
  }
}


export function getParameters(target: Object, methodKey: symbol | string): IParameter[] {
  return Reflect.getMetadata(MetaDataType.Parameter, target, methodKey) || []
}

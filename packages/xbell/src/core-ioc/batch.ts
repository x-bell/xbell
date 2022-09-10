import { ParameterType, MetaDataType } from '../constants/index';
import { genParameterDecorator } from '../utils/index';
import { IBatchData, IBatchDataOptions, MultiEnvData } from '../types/index';
import { container } from './container';

/**
 * 批量数据
 * @param list 数据列表（支持多环境）{ fat: [], prod: [] }
 * @param options 
 * @returns 
 */
export function BatchData<T>(list: T[] | MultiEnvData<T[]>, options: IBatchDataOptions<T> = {}): MethodDecorator {
  return function (target, propertyKey) {
    const data: IBatchData = {
      list,
      options
    };
    container.setBatchData(target.constructor, propertyKey, data);
  };
}

BatchData.Param = genParameterDecorator(ParameterType.BatchData);


/**
 * 多环境数据
 * @param data { fat: {}, prod: {} }
 * @returns 
 */
export function Data<T>(data: MultiEnvData<T>): MethodDecorator {
  return function (target, propertyKey) {
    Reflect.defineMetadata(MetaDataType.Data, data, target, propertyKey)
  };
}

Data.Param = genParameterDecorator(ParameterType.Data);

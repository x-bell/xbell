import { ParameterType } from '../constants/index'

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

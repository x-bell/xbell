import { ParameterType } from '../constants'

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

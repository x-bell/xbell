import { ValueOf } from '../types/utils'

export const ParameterType = {
  Data: Symbol('__data__'),
  BatchData: Symbol('__batch_data__'),
  Fixture: Symbol('__fixture__')
} as const

export type ParameterType = ValueOf<typeof ParameterType>

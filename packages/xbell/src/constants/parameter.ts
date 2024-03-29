import { ValueOf } from '../types/utils'

export const ParameterType = {
  Batch: Symbol('batch'),
  Each: Symbol('each'),
  Fixture: Symbol('fixture'),
  Page: Symbol('page'),
  Project: Symbol('project'),
  BatchData: Symbol('batchData'),
  Data: Symbol('data'),
} as const

export type ParameterType = ValueOf<typeof ParameterType>

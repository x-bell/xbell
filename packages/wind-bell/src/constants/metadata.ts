import { ValueOf } from '../types/utils'

export const MetaDataType = {
  Case: Symbol('__case__'),
  Data: Symbol('__data__'),
  BatchData: Symbol('__batch_data__'),
  Parameter: Symbol('__parameter__'),
  Depend: Symbol('__depend__'),
  Inject: Symbol('__inject__'),
  Fixtrue: Symbol('__fixture__'),
  Init: Symbol('__init__'),
  // Destroy: Symbol('__destroy__'),
  BeforeEachCase: Symbol('__before_each_case__'),
  BeforeAll: Symbol('__before_all__'),
  AfterEachCase: Symbol('__after_each_case__'),
  AfterAll: Symbol('__after_all__'),
  Fixme: Symbol('__fixme__'),
  Skip: Symbol('__skip__'),
} as const

export type MetaDataType = ValueOf<typeof MetaDataType>

import { MultiEnvData } from "./config"

export interface IBatchDataOptions<T = any> {
  primaryKey?: keyof T
}

export type IBatchData<T =  any> = {
  list: T[] | MultiEnvData<T[]>
  options?: IBatchDataOptions
}

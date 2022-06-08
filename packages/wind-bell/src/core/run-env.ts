import { WindBellConfig, BellBrowserType } from '../types'

export function RunBrowsers<T>(browsers: BellBrowserType[] | BellBrowserType): MethodDecorator | ClassDecorator {
  return (target: Object) => {
    console.log('RunBrowsers::typeof target', typeof target)
  }
}

export function RunEnvs<T>(env: WindBellConfig['runEnvs'] | WindBellConfig['runEnvs'][number]): MethodDecorator | ClassDecorator {
  return (target: Object) => {
    console.log('RunEnvs::typeof target', typeof target)
  }
}
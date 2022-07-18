import { XBellConfig, XBellBrowserType } from '../types/index'

export function RunBrowsers<T>(browsers: XBellBrowserType[] | XBellBrowserType): MethodDecorator | ClassDecorator {
  return (target: Object) => {
    console.log('RunBrowsers::typeof target', typeof target)
  }
}

export function RunEnvs<T>(env: XBellConfig['runEnvs'] | XBellConfig['runEnvs'][number]): MethodDecorator | ClassDecorator {
  return (target: Object) => {
    console.log('RunEnvs::typeof target', typeof target)
  }
}
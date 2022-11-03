import { spy, Mock } from './spy';

type Func = (...args: any[]) => any
function isMock(v: any): v is Mock {
  return !!v._isMockFunction;
}
function getOwnPropertyDescriptor<T extends object, K extends keyof T>(obj: T, methodName: K): PropertyDescriptor | undefined {
  const prototype = Object.getPrototypeOf(obj)
  const descriptor = Object.getOwnPropertyDescriptor(obj, methodName) || Object.getOwnPropertyDescriptor(prototype, methodName);
  return descriptor;
}

function _spyOn<T extends object, K extends keyof T>(
  obj: T,
  methodName: K,
  accessType: 'get' | 'set' | 'value' = 'value',
  mockFn?: T[K] extends Func ? (...args: Parameters<T[K]>) => ReturnType<T[K]> : Func,
  originFn?: T[K],
): T[K] extends Func ? Mock<Parameters<T[K]>, ReturnType<T[K]>> : Mock<any[], any> {
  const descriptor = getOwnPropertyDescriptor(obj, methodName);
  const origin = originFn ?? (() => {
    if (isMock(obj[methodName])) {
      return obj[methodName];
    }

    if (descriptor) {
      // 1. { key() {} }
      // 2. get key () { return xx }
      // 3. set key() {}
      return descriptor[accessType];
    }
    
    return accessType === 'value' ? obj[methodName] : () => obj[methodName];

  })();
  const mock = spy(mockFn ?? origin.bind?.(obj)) as Mock;

  Object.defineProperty(obj, methodName, {
    ...descriptor,
    [accessType]: mock,
  });

  mock.mockImplementation = (impl: T[K] extends Func ? (...args: Parameters<T[K]>) => ReturnType<T[K]> : Func) => {
    return _spyOn(obj, methodName, accessType, impl, origin);
  };

  mock.mockReturnValue = ((v: T[K] extends Func ? ReturnType<T[K]> : any) => {
    return _spyOn(obj, methodName, accessType, () => v, origin);
  });

  // @ts-ignore
  return mock;
}

// type A = 
export function spyOn<T extends object, K extends keyof T>(
  object: T,
  methodName: K,
  accessType?: 'get' | 'set',
): T[K] extends Func ? Mock<Parameters<T[K]>, ReturnType<T[K]>> : Mock<any[], any> {
  const original = object[methodName];
  if (isMock(original)) {
    return object[methodName] as any;
  }
  return _spyOn(object, methodName, accessType);
}

import { spy, Mock } from './spy';

type Func = (...args: any[]) => any
function isMock(v: any): v is Mock {
  return !!v._isMockFunction;
}
function getObjectOriginMethod<T extends object, K extends keyof T>(obj: T, methodName: K,
  // accessType?: 'get' | 'set'
): T[K] {
  const prototype = Object.getPrototypeOf(obj)
  const descriptor = Object.getOwnPropertyDescriptor(obj, methodName) || Object.getOwnPropertyDescriptor(prototype, methodName);
  let method = obj[methodName];

  if (!method && descriptor?.get) method = descriptor.get();

  if (isMock(method)) {
    return method._origin as unknown as T[K];
  }

  return method as T[K];
}

function _spyOn<T extends object, K extends keyof T>(
  obj: T,
  methodName: K,
  // accessType?: 'get' | 'set',
  mockFn?: T[K] extends Func ? (...args: Parameters<T[K]>) => ReturnType<T[K]> : Func,
  originFn?: T[K],
): T[K] extends Func ? Mock<Parameters<T[K]>, ReturnType<T[K]>> : Mock<any[], any> {
  // const prototype = Object.getPrototypeOf(obj)
  // const descriptor = Object.getOwnPropertyDescriptor(obj, methodName) || Object.getOwnPropertyDescriptor(prototype, methodName);
  let origin: T[K] | undefined = originFn;
  // if (!accessType) {
  if (!origin) origin = getObjectOriginMethod(obj, methodName);
    // @ts-ignore
  obj[methodName] = spy(mockFn ?? origin.bind?.(obj)) as Mock;
  // }
  // else {
  //   if (descriptor?.[accessType]) {
  //     if (!origin) origin = getObjectOriginMethod(obj, methodName, accessType);
  //     // @ts-ignore
  //     descriptor[accessType] = spy(mockFn ?? origin.bind(obj) as (...args: any[]) => any);
  //     Object.defineProperty(obj, methodName, descriptor);
  //   }
  // }

  const mock = obj[methodName] as unknown as Mock;

  mock.mockImplementation = (impl: T[K] extends Func ? (...args: Parameters<T[K]>) => ReturnType<T[K]> : Func) => {
    return _spyOn(obj, methodName, impl, origin);
  };

  mock.mockReturnValue = ((v: T[K] extends Func ? ReturnType<T[K]> : any) => {
    return _spyOn(obj, methodName, () => v, origin);
  });

  // @ts-ignore
  return obj[methodName];
}

// type A = 
export function spyOn<T extends object, K extends keyof T>(
  object: T,
  methodName: K,
  // accessType?: 'get' | 'set',
): T[K] extends Func ? Mock<Parameters<T[K]>, ReturnType<T[K]>> : Mock<any[], any> {
  const original = object[methodName];
  if (isMock(original)) {
    return object[methodName] as any;
  }
  return _spyOn(object, methodName);
}

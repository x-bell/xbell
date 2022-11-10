import { objectToString } from './proto';

export function isUndefined(v: any): v is undefined {
  return v === undefined;
}

export function isNull(v: any): v is null {
  return v === null;
}

export function isBoolean(v: any): v is boolean {
  return v === true || v === false;
}

export function isNumber(v: any): v is number {
  return typeof v === 'number';
}

export function isBigint(v: any): v is bigint {
  return typeof v === 'bigint';
}

export function isString(v: any): v is string {
  return typeof v === 'string';
}

export function isFunction(v: any): v is Function {
  const tag = objectToString(v);
  return typeof v === 'function'
    || tag === '[object Function]'
    || tag === '[object GeneratorFunction]'
    || tag === '[object AsyncFunction]';
}

export function isSymbol(v: any): v is symbol {
  return typeof v === 'symbol' || objectToString(v) === '[object Symbol]';
}

export function isWeakMap<K extends object, V>(v: WeakMap<K, V>): v is WeakMap<K, V>;
export function isWeakMap(v: any): v is WeakMap<any, any> {
  return objectToString(v) === '[object WeakMap]';
}

export function isWeakSet<T extends object>(v: WeakSet<T>): v is WeakSet<T>;
export function isWeakSet(v: any): v is WeakSet<any> {
  return objectToString(v) === '[object WeakSet]';
}

export function isRegExp(v: any): v is RegExp {
  return objectToString(v) === '[object RegExp]';
}

export function isDate(v: any): v is Date {
  return objectToString(v) === '[object Date]';
}

export function isError(v: any): v is Error {
  return objectToString(v) === '[object Error]' || v instanceof Error;
}

export function isArguments(v: any): v is ArrayLike<unknown> {
  return objectToString(v) === '[object Arguments]';
}

export function isObject(v: any): v is object {
  return v !== null && !Array.isArray(v) && typeof v === 'object';
}

export function isMap<K, V>(v: Map<K, V>): v is Map<K, V>;
export function isMap(v: any): v is Map<any, any> {
  return objectToString(v) === '[object Map]';
}

export function isSet<T extends object>(v: Set<T>): v is Set<T>;
export function isSet(v: any): v is Set<any> {
  return objectToString(v) === '[object Set]';
}

export function isArray(v: any): v is any[] {
  return Array.isArray(v);
}

export function isTypedArray<V>(v: ArrayLike<V>): v is ArrayLike<V> {
  const tag = objectToString(v);
  if (
    tag === '[object ArrayBuffer]'
    || tag === '[object DataView]'
    || tag === '[object Int8Array]'
    || tag === '[object Int16Array]'
    || tag === '[object Int32Array]'
    || tag === '[object Uint8Array]'
    || tag === '[object Uint8ClampedArray]'
    || tag === '[object Uint16Array]'
    || tag === '[object Uint32Array]'
    || tag === '[object Float32Array]'
    || tag === '[object Float64Array]'
  ) {
    return true;
  }

  return false;
}

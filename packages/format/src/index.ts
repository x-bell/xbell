import type { FormatConfig, FormatContext, FormatOptions } from './types';
import { checkOptions, optionsToConfig } from './utils/config';
import { objectToString } from './utils/proto';
import {
  formatNumber,
  formatBigInt,
  formatFunction,
  foramtSymbol,
  formatError,
  formatString,
  formatRegExp,
  formatDate,
  formatArguments,
  formatArray,
  formatTypedArray,
  formatObject,
  formatMap,
} from './format';
import {
  isBoolean,
  isUndefined,
  isNull,
  isNumber,
  isBigint,
  isString,
  isFunction,
  isSymbol,
  isWeakMap,
  isWeakSet,
  isRegExp,
  isDate,
  isError,
  isArguments,
  isObject,
  isMap,
  isTypedArray,
  isArray
} from './utils/is';

function formatImp(val: any, config: FormatConfig, context: FormatContext): string {
  if (isUndefined(val)) return 'undefined';
  if (isNull(val)) return 'null';
  if (isBoolean(val)) return String(val);
  if (isNumber(val)) return formatNumber(val);
  if (isBigint(val)) return formatBigInt(val);
  if (isString(val)) return formatString(val);
  if (isFunction(val)) return formatFunction(val, config);
  if (isSymbol(val)) return foramtSymbol(val);
  if (isRegExp(val)) return formatRegExp(val);
  if (isDate(val)) return formatDate(val);
  if (isError(val)) return formatError(val);
  if (isWeakMap(val)) return 'WeakMap {}';
  if (isWeakSet(val)) return  'WeakSet {}';
  if (isArguments(val)) return formatArguments(val, config, context);
  if (isTypedArray(val)) return formatTypedArray(val, config, context);
  if (isArray(val)) return formatArray(val, config, context);
  if (isMap(val)) return formatMap(val, config, context);
  if (isObject(val)) return formatObject(val, config, context);
  return '';
}

export function format(v: any, options: FormatOptions = {}): string {
  checkOptions(options);
  const config = optionsToConfig(options);
  const context: FormatContext = {
    currentIndent: 0,
    refs: new WeakSet(),
    format: formatImp,
  };
  return formatImp(v, config, context);
}

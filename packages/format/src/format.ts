import type { FormatConfig, FormatContext } from './types';


// const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
// const NEWLINE_REGEXP = /\n/gi;

function _formatArrayItems(v: ArrayLike<any>, config: FormatConfig, context: FormatContext) {
  if (!v.length) return '';

  const beforeIndent = context.currentIndent;
  const currentIndent = context.currentIndent += config.indent;
  const beforeIndentStr = ' '.repeat(beforeIndent);
  const currentIndentStr = ' '.repeat(currentIndent);

  const ret = Array.from(v).map((val, idx) =>
      currentIndentStr + (idx in v ? 
         context.format(val, config, context)
       : '')
    ).join(
    config.inline ? ',' : `,${config.innerSeparator}`
  )

  context.currentIndent -= config.indent;

  return `\n${ret}\n${beforeIndentStr}`;
}

function _formatObjectEntries(entries: [any, any][], config: FormatConfig, context: FormatContext, separator: string): string {
  const beforeIndent = context.currentIndent;
  const beforeIndentStr = ' '.repeat(beforeIndent);
  const currentIndent = context.currentIndent += config.indent;
  const currentIndentStr = ' '.repeat(currentIndent);
  const ret = entries
    .map(([key, value]) => `${currentIndentStr}${context.format(key, config, context)}${separator}${context.format(value, config, context)}`)
    .join(',' + config.innerSeparator);

  context.currentIndent -= config.indent;
  return `\n${ret}\n${beforeIndentStr}`;
}

export function formatNumber(v: number): string {
  return Object.is(v, -0) ? '-0' : String(v);
}

export function formatString(v: string): string {
  return `"${v}"`;
}

export function formatBigInt(v: bigint): string {
  return String(`${v}n`);
}

export function formatFunction(v: Function, options: FormatConfig): string {
  if (options?.ignoreFunctionName) {
    return '[Function]';
  }
  return `[Function ${v.name || 'anonymous'}]`;
}

export function foramtSymbol(v: symbol): string {
  return v.toString()
}

export function formatError(v: Error): string {
  return `[${Error.prototype.toString.call(v)}]`;
}

export function formatRegExp(v: RegExp): string {
  return RegExp.prototype.toString.call(v);
}

export function formatDate(v: Date): string {
  return isNaN(+v) ? 'Date { NaN }' : Date.prototype.toISOString.call(v);
}

export function formatArray(v: any[], config: FormatConfig, context: FormatContext): string {
  return `Array [${_formatArrayItems(v, config, context)}]`;
}

export function formatArguments(v: ArrayLike<any>, config: FormatConfig, context: FormatContext): string {
  return `Arguments [${_formatArrayItems(v, config, context)}]`;
}

export function formatTypedArray(v: ArrayLike<any>, config: FormatConfig, context: FormatContext): string {
  return `${v.constructor.name} [${_formatArrayItems(v, config, context)}]`;
}

export function formatObject(v: object, config: FormatConfig, context: FormatContext) {
  const keys = [
    ...Object.keys(v).sort(),
    ...Object.getOwnPropertySymbols(v).filter(symbol => (Object.getOwnPropertyDescriptor(v, symbol)!.enumerable))
  ].map(key => [key, v[key as keyof typeof v]] as [string | symbol, any]);

  return `${v.constructor?.name ?? 'Object'} {${_formatObjectEntries(keys, config, context, ': ')}}`;
}

export function formatMap<K, V>(v: Map<K, V>, config: FormatConfig, context: FormatContext): string {
  if (v.size === 0) {
    return 'Map {}'
  }
  return `Map {${_formatObjectEntries(Array.from(v), config, context, ' => ')}}`;
}

export function formatSet<T>(v: Set<T>, config: FormatConfig, context: FormatContext): string {
  if (v.size === 0) {
    return 'Set {}'
  }
  return `Set {${_formatArrayItems(Array.from(v), config, context)}}`;
}

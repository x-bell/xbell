export type TypedArray =
  | ArrayBuffer
  | DataView
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint16Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export type FormatOptions = Partial<{
  ignoreFunctionName: boolean;
  maxDepth: number | false;
  inline: boolean;
  indent: number;
}>

export interface FormatConfig {
  ignoreFunctionName: boolean;
  maxDepth: number | false;
  innerSeparator: string
  outerSeparator: string;
  indent: number;
  inline: boolean;
}

export interface FormatContext {
  refs: WeakSet<object>
  currentIndent: number;
  format(v: any, config: FormatConfig, context: FormatContext): string
}

export interface Location {
  lines: number;
  columns: number;
  filename: string;
}

export interface FormatOptions {
  includes?: RegExp | string | Array<RegExp | string>;
}

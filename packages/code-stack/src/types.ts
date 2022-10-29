export interface Location {
  line: number;
  column: number;
  filename: string;
}

export interface FormatOptions {
  includes?: RegExp | string | Array<RegExp | string>;
}

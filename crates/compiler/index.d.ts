/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface CompileOptions {
  conditions: Array<string>
  extensions: Array<string>
  cwd: string
  isCallbackFunction: boolean
}
export function compile(sourceCode: string, fileName: string, options: CompileOptions): string

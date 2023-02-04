import type { ImportDeclaration, Program } from '@swc/core';
import { parse } from '@swc/core';
import { analyse } from './analyse';
export { resolve } from './resolve';
export { getContentType } from './utils';
interface PackFile {
  id: string;
  filename: string;
  imports: string[];
  dynamicImports?: string[];
  requires: string;
  type: 'cjs' | 'esm';
  css?: string;
}

export class Pack {
  async trasnform(code: string, filename: string, options?: {}) {
    const program = await parse(code, {
      syntax: 'typescript',
      tsx: true,
    });
    const { imports } = analyse(program);
    return {
      imports
    }
  }
}

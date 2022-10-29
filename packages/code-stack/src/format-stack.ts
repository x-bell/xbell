import type { Location } from './types';
import { existsSync, readFileSync } from 'fs';

const NEW_LINE_REG = /[\r\n\u2028\u2029]|\r\n/;

export function formatSpace(num: number, maxLength: number) {
  const numLen = String(num).length;
  return numLen < maxLength ? ` ${num}` : String(num);
}

export function formatStack(
  sourceCodeOrFilename: string,
  loc: Omit<Location, 'filename'>,
): string {
  const isFilename = existsSync(sourceCodeOrFilename);
  const sourceCode = isFilename ? readFileSync(sourceCodeOrFilename, 'utf-8') : sourceCodeOrFilename;
  const codes = sourceCode.split(NEW_LINE_REG);
  const startLine = Math.max(loc.line - 2, 1);
  const endLine = Math.min(loc.line + 2, codes.length);

  const displayCodes = codes.slice(startLine - 1, endLine);
  const maxNum = startLine + displayCodes.length - 1;
  const maxNumStrLength = String(maxNum).length;
  return displayCodes.map((lineCode, idx) => {
    const num = startLine + idx;
    const isTargetNum = num === loc.line;
    return `${isTargetNum ? '>' : ' '} ${formatSpace(num, maxNumStrLength)} | ${lineCode}` + (isTargetNum ? `\n${' '.repeat(loc.column + 4 + maxNumStrLength)}^` : '');
  }).join('\n');
}

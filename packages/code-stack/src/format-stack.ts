import type { Location } from './types';
import { existsSync, readFileSync } from 'fs';

const NEW_LINE_REG = /[\r\n\u2028\u2029]|\r\n/;

export function formatStack(sourceCodeOrFilename: string, loc: Omit<Location, 'filename'>): string {
  const isFilename = existsSync(sourceCodeOrFilename);
  const sourceCode = isFilename ? readFileSync(sourceCodeOrFilename, 'utf-8') : sourceCodeOrFilename;
  const codes = sourceCode.split(NEW_LINE_REG);
  const startLine = Math.max(loc.lines - 2, 1);
  const endLine = Math.min(loc.lines + 2, codes.length);

  const displayCodes = codes.slice(startLine - 1, endLine);
  return displayCodes.map((lineCode, idx) => {
    const num = startLine + idx;
    const isTargetNum = num === loc.lines;

    return `${isTargetNum ? '>' : ' '} ${num} | ${lineCode}` + (isTargetNum ? `\n${' '.repeat(loc.columns + 6 - 1)}^` : '');
  }).join('\n');
}

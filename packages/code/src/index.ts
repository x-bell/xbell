import { readFileSync } from 'fs';

interface Location {
  lines: number;
  columns: number;
}

const NEW_LINE_REG = /[\r\n\u2028\u2029]|\r\n/;

export function displayCode(sourceCode: string, loc: Location): string {
  const codes = sourceCode.split(NEW_LINE_REG);
  const startLine = Math.max(loc.lines - 2, 1);
  const endLine = Math.min(loc.lines + 2, codes.length);
  const displayCodes = codes.slice(startLine - 1, endLine);
  return displayCodes.map((lineCode, idx) => {
    const num = startLine + idx;
    const isTargetNum = num === loc.lines;

    return `${isTargetNum ? '>' : ' '} ${num} | ${lineCode}` + (isTargetNum ? `\n${' '.repeat(loc.columns + 6)}^` : '');
  }).join('\n');
}

const sourceCode = readFileSync('/Users/lianghang/Desktop/github/xlianghang/bell/packages/format/src/format.ts', 'utf-8')

const target = displayCode(sourceCode, {
  lines: 85,
  columns: 11,
});

console.log('target');
console.log();
console.log(target);

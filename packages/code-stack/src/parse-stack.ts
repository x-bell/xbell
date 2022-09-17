import type { Location } from './types';

const FILTER_FILENAME_REG = [
  /node_modules/,
  /node:/
];

const STACK_LINE_REG = /\((.+?):(\d+):(\d+)\)$/;

export function parseStack(stack: string): {
  location: Location;
  message: string;
  codeLines: string[];
} | null {
  if (!stack)
    return null;

  const lines = stack.split('\n')
  let firstCodeLineIndex = lines.findIndex(line => line.startsWith('    at '));
  if (firstCodeLineIndex === -1) {
    firstCodeLineIndex = lines.length - 1;
  }
  const message = lines.slice(0, firstCodeLineIndex).join('\n');
  const codeLines = lines.slice(firstCodeLineIndex);
  for (const line of codeLines) {
    const location = _parseStackLine(line);
    const isFilter = _filterStackLine(location);
    if (!isFilter) {
      return {
        location,
        message,
        codeLines,
      };
    }
  }
}


function _filterStackLine(location: Location | null) {
  return !location || !location.filename || FILTER_FILENAME_REG.some(reg => reg.test(location.filename));
}

function _getRelativeFilename (filename: string, cwd = process.cwd()) {
  filename = filename.replace(/\\/g, '/');
  if (filename.startsWith(`${cwd}/`)) {
    filename = filename.slice(cwd.length + 1);
  }

  return filename;
}


function _parseStackLine(line: string): null | Location {
  if (!line)
    return null

  const [
    ,
    filename,
    lines,
    columns,
  ] = line.match(STACK_LINE_REG) ?? [];

  if (!filename || !lines || !columns)
    return null

  return {
    columns: Number(columns),
    lines: Number(lines),
    filename: _getRelativeFilename(filename),
  }
}

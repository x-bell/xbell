import type { FormatOptions, Location } from './types';
import { resolve } from 'path';
import debug from 'debug';

const debugParseStack = debug('xbell:parse-stack');

const FILTER_FILENAME_REG = [
  /node_modules/,
  /node:/
];

const STACK_LINE_REG = /\((.+?):(\d+):(\d+)\)$/;

export function parseStack(stack: string, opts: FormatOptions = {}): {
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
  debugParseStack('codeLines', codeLines);
  for (const line of codeLines) {
    const location = parseStackLine(line);
    const isIgnore = _isIgnoreLine(location, opts);

    if (!isIgnore) {
      return {
        location: location!,
        message,
        codeLines,
      };
    }
  }

  return null;
}


function _isIgnoreLine(location: Location | null, opts: FormatOptions = {}) {
  const includes = (() => {
    if (!opts.includes) return [];
    if (Array.isArray(opts.includes)) return opts.includes!;
    return [opts.includes!]
  })();
  const filename = location?.filename ? resolve(process.cwd(), location.filename) : undefined;
  debugParseStack('isIgnoreLine', filename, location?.filename);
  return !location ||
    !location.filename ||
    FILTER_FILENAME_REG.some(reg => reg.test(filename!)) ||
    (
      includes.length
        ? includes.every(
            reg => typeof reg === 'string'
              ? !filename!.includes(reg)
              : !reg.test(filename!)
          )
        : false
    );
}

const FILE_PREFIX = 'file://';

function _getFilenamePath (filename: string, cwd = process.cwd()) {
  if (filename.startsWith(FILE_PREFIX)) {
    filename = filename.slice(FILE_PREFIX.length);
  }
  // filename = filename.replace(/\\/g, '/');
  // if (filename.startsWith(`${cwd}/`)) {
  //   filename = filename.slice(cwd.length + 1);
  // }

  return filename;
}


export function parseStackLine(line: string): null | Location {
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
    column: Number(columns),
    line: Number(lines),
    filename: _getFilenamePath(filename),
  }
}

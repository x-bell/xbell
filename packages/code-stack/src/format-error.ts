import type { FormatOptions } from './types';
import { formatStack } from './format-stack';
import { parseStack } from './parse-stack';

export function formatError(error: Error, opts: FormatOptions = {}) {
  const { stack } = error || {};
  if (!stack)
    return null;

  const parsed = parseStack(stack, opts);

  if (!parsed)
    return null;

  const {
    columns,
    lines,
    filename,
  } = parsed.location;
  const ret = formatStack(filename, { columns, lines });
  return {
    filename,
    stack: ret,
    message: parsed.message,
    codeLines: parsed.codeLines,
  };
}

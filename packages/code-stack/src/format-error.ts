import { formatStack } from './format-stack';
import { parseStack } from './parse-stack';

export function formatError(error: Error): string | null {
  const { stack } = error || {};
  if (!stack)
    return null;

  const parsed = parseStack(stack)

  if (!parsed)
    return null;

  const {
    columns,
    lines,
    filename
  } = parsed.location;

  return formatStack(filename, { columns, lines });
}

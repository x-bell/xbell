import * as path from 'node:path';
import * as fs from 'node:fs';

export function dirname(pathname: string): string {
  const stat = fs.statSync(pathname)
  if (stat.isDirectory()) {
    return pathname;
  }

  return path.dirname(pathname);
}

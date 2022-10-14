import * as fs from 'node:fs';
import * as path from 'node:path';

export function ensureDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    return;
  }

  fs.mkdirSync(dirPath, {
    mode: 0o777,
    recursive: true,
  });
}

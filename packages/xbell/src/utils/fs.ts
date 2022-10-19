import * as fs from 'node:fs';

export function ensureDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    return;
  }

  fs.mkdirSync(dirPath, {
    mode: 0o777,
    recursive: true,
  });
}

export function fouceRemove(path: string) {
  fs.rmSync(path, {
    recursive: true,
    force: true,
  });
}

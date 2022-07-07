import * as path from 'path';

const cwd = process.cwd();

export function getBrowserCaseDirPath(filename: string) {
  const relativePath = path.dirname(path.relative(cwd, filename));
  return path.join(cwd, '.xbell/unit', relativePath);
}

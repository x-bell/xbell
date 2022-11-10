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

export function getSnapshotFilePath({
  projectName,
  name,
  filepath,
  type
}: {
  projectName?: string;
  name: string;
  filepath: string;
  type: 'js' | 'image'
}) {
  const suffix = type === 'image' ? '.png' : '.js.snap';
  const diffSuffix = type === 'image' ? '.png' : '.log';
  const snapshotFilename = name + (projectName ? `-[${projectName}]` : '') + suffix;

  const snapshotBasePath = path.join(
    path.dirname(filepath),
    '__snapshots__',
    path.basename(filepath),
    snapshotFilename
  );

  const newDir = snapshotBasePath + '-new';

  return {
    filepath: snapshotBasePath + suffix,
    newFilepath: path.join(newDir, snapshotFilename),
    diffFilepath: path.join(newDir, `diff${diffSuffix}`),
  };
}

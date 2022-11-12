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
  const withProjectName = name + (projectName ? `-[${projectName}]` : '');

  const snapshotBasePath = path.join(
    path.dirname(filepath),
    '__snapshots__',
    path.basename(filepath),
    withProjectName
  );
  const snapshotPath = snapshotBasePath + suffix;

  const newDir = snapshotBasePath + '-new';

  return {
    filepath: snapshotPath,
    newFilepath: path.join(newDir, snapshotPath),
    diffFilepath: path.join(newDir, `diff${diffSuffix}`),
  };
}

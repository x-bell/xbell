import * as fs from 'node:fs';
import * as path from 'node:path';
import color from '@xbell/color';
import { PNG } from 'pngjs'
import { Buffer } from 'node:buffer';
import pixcelMatch from 'pixelmatch';
import { ensureDir, getSnapshotFilePath } from './utils';


// const snapshotDebug = debug('xbell:snapshot');
export interface ToMatchImageSnapshotOptions {
  /**
   * Image name
   */
  name: string;
  /**
   * 
   * The number of different pixels.
   * @default 0
   */
  maxDiffPixels?: number;
  /**
   * The ratio of different pixels, ranges from 0 to 1.
   * @default undefined
   */
  maxDiffPixelRatio?: number;
  /**
   * Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive.
   * @default 0.2
   */
  threshold?: number;
}


export function matchImageSnapshot({
  buffer,
  options,
  projectName,
  filepath,
}: {
  buffer: Buffer | Uint8Array;
  options: ToMatchImageSnapshotOptions;
  projectName?: string;
  filepath: string;
}) {
  // snapshotDebug('_matchImageSnapshot');
  const { maxDiffPixels, maxDiffPixelRatio, name, threshold = 0.2 } = options;
  const { filepath: snapshotPath } = getSnapshotFilePath({
    name,
    projectName,
    filepath,
    type: 'image',
  });
  const existSnapshot = fs.existsSync(snapshotPath);
  const dirPath = path.dirname(snapshotPath);
  if (!existSnapshot) {
    ensureDir(dirPath);
    fs.writeFileSync(snapshotPath, buffer)
  } else {
    const originSnatshot = PNG.sync.read(fs.readFileSync(snapshotPath))
    const currentSnapshot = PNG.sync.read(Buffer.from(buffer))
    const { width, height } = originSnatshot
    const diffPNG = new PNG({ width, height });
    const diff = pixcelMatch(
      originSnatshot.data,
      currentSnapshot.data,
      diffPNG.data,
      width,
      height,
      { threshold }
    );

    const expectDiffCount = (() => {
      if (typeof maxDiffPixels === 'number') return maxDiffPixels;
      if (typeof maxDiffPixelRatio === 'number') return width * height * maxDiffPixelRatio;
      return 0;
    })();
    if (diff > expectDiffCount) {
      const diffDir = path.join(snapshotPath + '-diff');
      if (fs.existsSync(diffDir)) {
        fs.rmSync(diffDir, {
          recursive: true,
          force: true,
        });
      }
      ensureDir(diffDir);
      const diffPngPath = path.join(diffDir, 'diff.png');
      const newPngPath = path.join(diffDir, path.basename(snapshotPath));
      fs.writeFileSync(
        newPngPath,
        buffer
      );
      fs.writeFileSync(
        diffPngPath,
        PNG.sync.write(diffPNG)
      );
      return {
        pass: false,
        message: ({ not }: { not: boolean }) => [
          `ImageSnapshot "${name}" ${not ? 'matched' : 'mismatched'}`,
          '',
          color.green('Expected: ') + color.green.underline(snapshotPath),
          color.red('Received: ') + color.red.underline(newPngPath),
          color.yellow('    Diff: ') + color.yellow.underline(diffPngPath)
        ].join('\n'),
      }
    }
  }

  return {
    pass: true,
    message: () => '',
  }
}

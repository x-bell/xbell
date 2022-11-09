import * as fs from 'node:fs';
import * as path from 'node:path';
import color from '@xbell/color';
import { PNG } from 'pngjs'
import { Buffer } from 'node:buffer';
import pixcelMatch from 'pixelmatch';
import { PageScreenshotOptions, ElementHandleScreenshotOptions } from '../../types/pw';
import debug from 'debug';
import { ensureDir } from '../../utils/fs';
import { pathManager } from '../../common/path-manager';

const snapshotDebug = debug('xbell:snapshot');
export interface ToMatchSnapshotOptions {
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

export function getSnapshotPath({
  projectName,
  rootDir,
  imgName,
  filepath
}: {
  rootDir: string;
  projectName?: string;
  imgName: string;
  filepath: string;
}) {
  return path.join(
    path.dirname(filepath),
    '__snapshots__',
    path.basename(filepath),
    imgName.replace(/\.png$/, '')
      + (projectName ? `.[${projectName}]` : '')
      + '.png'
  );
}

export interface ScreenshotTarget {
  screenshot(options: PageScreenshotOptions | ElementHandleScreenshotOptions): Promise<Buffer>
}

export async function _matchImageSnapshot({
  buffer,
  options,
  projectName,
  filepath,
}: {
  buffer: Buffer | Uint8Array;
  options: ToMatchSnapshotOptions;
  projectName?: string;
  filepath: string;
}) {
  snapshotDebug('_matchImageSnapshot');
  const { maxDiffPixels, maxDiffPixelRatio, name, threshold = 0.2 } = options;
  const messages: string[] = [];
  const snapshotPath = getSnapshotPath({
    rootDir: pathManager.projectDir,
    imgName: name,
    projectName,
    filepath,
  });
  const isFirstSnapshot = fs.existsSync(snapshotPath);
  snapshotDebug('snapshotPath', snapshotPath, isFirstSnapshot);
  const dirPath = path.dirname(snapshotPath);
  if (!isFirstSnapshot) {
    ensureDir(dirPath);
    fs.writeFileSync(snapshotPath, buffer)
  } else {
    const originSnatshot = PNG.sync.read(fs.readFileSync(snapshotPath))
    const currentSnapshot = PNG.sync.read(Buffer.from(buffer))
    const { width, height } = originSnatshot
    const diffPNG = new PNG({ width, height });
    const diff = pixcelMatch(originSnatshot.data, currentSnapshot.data, diffPNG.data, width, height, {
      threshold,
    });
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
      messages.push(color.green('Expected: ') + color.green.underline(snapshotPath));
      messages.push(color.red('Received: ') + color.red.underline(newPngPath));
      messages.push(color.yellow('    Diff: ') + color.yellow.underline(diffPngPath));
      return {
        pass: false,
        message: () => messages.join('\n'),
      }
    }
  }

  return {
    pass: true,
    message: () => '',
  }
}

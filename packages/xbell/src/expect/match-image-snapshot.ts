import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { PNG } from 'pngjs'
import pixcelMatch from 'pixelmatch';
import { PageScreenshotOptions, ElementHandleScreenshotOptions } from '../types/pw';

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
  imgName
}: {
  rootDir: string;
  projectName: string;
  imgName: string;
}) {
  return path.join(rootDir, '__snapshots__', imgName, `.[${projectName}]` + '.png');
}

export interface ScreenshotTarget {
  screenshot(options: PageScreenshotOptions | ElementHandleScreenshotOptions): Promise<Buffer>
}

export async function _matchImageSnapshot(projectName: string, screenshotTarget: ScreenshotTarget, options: ToMatchSnapshotOptions) {
  const { maxDiffPixels, maxDiffPixelRatio, name, threshold = 0.2 } = options;
  const messages: string[] = [];
  if (typeof screenshotTarget?.screenshot !== 'function') {
    throw new Error('toMatchSnapshot: The received object is missing the "sreenshot" method');
  }

  const buffer = await screenshotTarget.screenshot({
    type: 'png'
  });

  const snapshotPath = getSnapshotPath({
    rootDir: process.cwd(),
    projectName,
    imgName: name,
  });

  if (!fs.existsSync(snapshotPath)) {
    fs.mkdirSync(path.dirname(snapshotPath));
    fs.writeFileSync(snapshotPath, buffer)
  } else {
    const originSnatshot = PNG.sync.read(fs.readFileSync(snapshotPath))
    const currentSnapshot = PNG.sync.read(buffer)
    const { width, height } = originSnatshot
    const diffPNG = new PNG({ width, height });
    const diff = pixcelMatch(originSnatshot.data, currentSnapshot.data, diffPNG.data, width, height, {
      threshold,
    })
    const expectDiffCount = (() => {
      if (typeof maxDiffPixels === 'number') return maxDiffPixels;
      if (typeof maxDiffPixelRatio === 'number') return width * height * maxDiffPixelRatio;
      return 0;
    })();
    if (diff > expectDiffCount) {
      const diffPngPath = snapshotPath.replace(/\.png$/, '.diff.png');
      const newPngPath =  snapshotPath.replace(/\.png$/, '.new.png');
      fs.writeFileSync(
        newPngPath,
        buffer
      );
      fs.writeFileSync(
        diffPngPath,
        PNG.sync.write(diffPNG)
      );
      messages.push(`Expected: ${pc.yellow(snapshotPath)}`)
      messages.push(`Received: ${pc.red(newPngPath)}`)
      messages.push(`    Diff: ${pc.yellow(diffPngPath)}`)
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
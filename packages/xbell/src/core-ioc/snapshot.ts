import * as path from 'path';
import * as fs from 'fs-extra';
import {  MatcherFunctionWithState } from 'expect';
import { PageScreenshotOptions } from 'playwright-core';
import { Context } from './context';
import { PNG } from 'pngjs'
import filenamify from 'filenamify';
import pixcelMatch from 'pixelmatch';
import chalk  from 'chalk';

export function getSnapshotPath(rootDir: string, groupName: string, caseName: string, env: string, imgName = 'default') {
  return path.join(rootDir, '__snapshots__', filenamify(groupName), filenamify(caseName), filenamify(imgName) + `[${env}]` + '.png');
}

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

export interface ScreenshotTarget {
  screenshot(options: PageScreenshotOptions): Promise<Buffer>
}

export async function toMatchSnapshot(ctx: Context, screenshotTarget: ScreenshotTarget, options: ToMatchSnapshotOptions): Promise<ReturnType<MatcherFunctionWithState>> {
  const { maxDiffPixels, maxDiffPixelRatio, name, threshold = 0.2 } = options;
  const messages: string[] = [];
  if (typeof screenshotTarget?.screenshot !== 'function') {
    throw new Error('toMatchSnapshot: The received object is missing the "sreenshot" method');
  }

  const buffer = await screenshotTarget.screenshot({
    type: 'png'
  });

  const snapshotPath = getSnapshotPath(ctx.rootDir, ctx.caseInfo.groupName, ctx.caseInfo.caseName, ctx.envConfig.name, name || 'default');

  if (!fs.existsSync(snapshotPath)) {
    fs.ensureDirSync(path.dirname(snapshotPath));
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
      messages.push(`Expected: ${chalk.yellow(snapshotPath)}`)
      messages.push(`Received: ${chalk.red(newPngPath)}`)
      messages.push(`    Diff: ${chalk.yellow(diffPngPath)}`)
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
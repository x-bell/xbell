import * as path from 'path';
import * as fs from 'fs-extra';
import {  MatcherFunctionWithState } from 'expect';
import { PageScreenshotOptions } from 'playwright-core';
import { Context } from './context';
import { PNG } from 'pngjs'
import filenamify = require('filenamify');
import pixcelMatch = require('pixelmatch');
import chalk = require('chalk');
import jimp = require('jimp')

const EXT_REG = /\.(png|jpe?g)$/;

export function getSnapshotPath(rootDir: string, groupName: string, caseName: string, env: string, imgName = 'default') {
  const name = filenamify(imgName);
  const ext = name.split('.').pop();
  return path.join(rootDir, '__snapshots__', filenamify(groupName), filenamify(caseName),  name.replace(EXT_REG, `[${env}].` + ext));
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

async function formatImageBuffer(buffer: Buffer) {
  const { fileTypeFromBuffer } = await import('file-type');

  const ret = await fileTypeFromBuffer(buffer);
  if (!ret) {
    throw new Error('toMatchSnapshot: Invalid image type');
  }

  if (ret.mime === 'image/jpeg') {
    const img = await jimp.read(buffer);
    const pngBuffer = await img.getBufferAsync('image/png');
    return {
      originBuffer: buffer,
      pngBuffer,
      ext: 'jpg',
    } as const;
  }

  if (ret.mime === 'image/png') {
    return {
      pngBuffer: buffer,
      ext: 'png',
      originBuffer: undefined,
    } as const;
  }

  throw new Error('toMatchSnapshot: Only support png、jpeg/jpg');

}

async function pngToJpeg(buffer: Buffer) {
  const img = await jimp.read(buffer);
  const jpegBuffer = await img.getBufferAsync('image/jpeg');
  return jpegBuffer;
}

export async function toMatchSnapshot(ctx: Context, screenshotTarget: ScreenshotTarget | Buffer, options: ToMatchSnapshotOptions): Promise<ReturnType<MatcherFunctionWithState>> {
  const { maxDiffPixels, maxDiffPixelRatio, name, threshold = 0.2 } = options;
  const messages: string[] = [];
  const receivedNameExt = name.split('.').pop()
  // let receivedBuffer: Buffer;
  // if (Buffer.isBuffer(screenshotTarget)) {
  //   receivedBuffer = screenshotTarget;
  // }

  if (!Buffer.isBuffer(screenshotTarget) && typeof (screenshotTarget as ScreenshotTarget)?.screenshot !== 'function') {
    throw new Error('toMatchSnapshot: The received object is a buffer or with the "sreenshot" method');
  }

  const {
    originBuffer,
    pngBuffer,
    ext
  } = Buffer.isBuffer(screenshotTarget) ? await formatImageBuffer(screenshotTarget) : {
    ext: 'png',
    pngBuffer: await screenshotTarget.screenshot({
      type: 'png',
    }),
    originBuffer: undefined,
  } as const;

  const isJpgSource = ext === 'jpg';
  const snapshotPath = getSnapshotPath(ctx.rootDir, ctx.caseInfo.groupName, ctx.caseInfo.caseName, ctx.envConfig.ENV, name.replace(EXT_REG, `.${ext}`) || `default.${ext}`);
  if (!fs.existsSync(snapshotPath)) {
    fs.ensureDirSync(path.dirname(snapshotPath));
    fs.writeFileSync(snapshotPath, pngBuffer)
  } else {
    const originSnatshot = PNG.sync.read(fs.readFileSync(snapshotPath))
    const currentSnapshot = PNG.sync.read(pngBuffer)
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
      const diffPngPath = snapshotPath.replace(EXT_REG, `.diff.${ext}`);
      const newPngPath =  snapshotPath.replace(EXT_REG, `.new.${ext}`);
      fs.writeFileSync(
        newPngPath,
        ext === 'jpg' ? originBuffer : pngBuffer,
      );
      fs.writeFileSync(
        diffPngPath,
        isJpgSource ? await pngToJpeg(PNG.sync.write(diffPNG)) : PNG.sync.write(diffPNG)
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
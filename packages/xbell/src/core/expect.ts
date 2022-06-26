import * as fs from 'fs-extra';
import * as path from 'path';
import { PNG } from 'pngjs'
import { createDecoratorImpl } from './custom'
import pixcelMatch = require('pixelmatch');
import filenamify = require('filenamify');


const NoPageError = createDecoratorImpl(async (ctx, next) => {
  const errors: Error[] = [];
  ctx.page.on('pageerror', (message) => {
      errors.push(message);
  });

  await next();

  ctx.expect(errors.length).toBe(0);
});

function getSnapshotPath(rootDir: string, groupName: string, caseName: string, env: string, imgName = 'default') {
  return path.join(rootDir, '__snapshots__', filenamify(groupName), filenamify(caseName), filenamify(imgName) + `[${env}]` + '.png');
}
// TODO:
const SnapshotMatch = createDecoratorImpl<Partial<{
  imageName: string;
  diffPXCount: number;
  diffPXRatio: number;
}> | void>(async (ctx, next, { imageName, diffPXCount, diffPXRatio } = {}) => {
  await next();
  await ctx.page.waitForLoadState('networkidle');
  const buffer = await ctx.page.screenshot({
    type: 'png',
  })
  const snapshotPath = getSnapshotPath(ctx.rootDir, ctx.caseInfo.groupName, ctx.caseInfo.caseName, ctx.envConfig.ENV, imageName || 'default');
  if (!fs.existsSync(snapshotPath)) {
    fs.ensureDirSync(path.dirname(snapshotPath));
    fs.writeFileSync(snapshotPath, buffer)
  } else {
    const originSnatshot = PNG.sync.read(fs.readFileSync(snapshotPath))
    const currentSnapshot = PNG.sync.read(buffer)
    const { width, height } = originSnatshot
    const diffPNG = new PNG({ width, height });
    const diff = pixcelMatch(originSnatshot.data, currentSnapshot.data, diffPNG.data, width, height, {
      threshold: 0.05
    })
    const expectDiffCount = (() => {
      if (typeof diffPXCount === 'number') return diffPXCount;
      if (typeof diffPXRatio === 'number') return width * height * diffPXRatio;
      return 0;
    })();
    if (diff > expectDiffCount) {
      const diffPngPath = snapshotPath.replace(/\.png$/, '.diff.png');
      fs.writeFileSync(
        snapshotPath.replace(/\.png$/, '.new.png'),
        buffer
      );
      fs.writeFileSync(
        diffPngPath,
        PNG.sync.write(diffPNG)
      );
      throw new Error('快照对比失败，请查看：' + diffPngPath);
    }
  }
})

export const Expect = {
  NoPageError,
  SnapshotMatch,
};


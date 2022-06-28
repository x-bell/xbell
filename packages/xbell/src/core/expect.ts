import { createDecoratorImpl } from './custom'
import { ToMatchSnapshotOptions } from './snapshot';

const NoPageError = createDecoratorImpl(async (ctx, next) => {
  const errors: Error[] = [];
  ctx.page.on('pageerror', (message) => {
    errors.push(message);
  });

  await next();

  ctx.expect(errors.length).toBe(0);
});

const ToMatchSnapshot = createDecoratorImpl<ToMatchSnapshotOptions>(
  async (
    ctx,
    next,
    { maxDiffPixelRatio, maxDiffPixels, threshold, name }: ToMatchSnapshotOptions
  )=> {
    await next();
    await ctx.page.waitForLoadState('networkidle');
    await ctx.expect(ctx.page).toMatchSnapshot({ maxDiffPixelRatio, maxDiffPixels, threshold, name });
  })

export const Expect = {
  NoPageError,
  ToMatchSnapshot,
};


import { Test } from 'xbell';


@Test()
class TestCase {
  @Inject()
  ctx: Context;

  @Viewport({ width: 1300, height: 1000 })
  @Expect.ToMatchSnapshot({ name: 'xbell-homepage' })
  @Expect.NoPageError()
  async testSnapshot() {
    const { page, expect } = this.ctx;
    await this.ctx.page.goto('https://x-bell.github.io/xbell/');
    await expect(page.queryByClass('features_t9lD')).toMatchSnapshot({ name: 'features' });
  }
}

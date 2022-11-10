import { Test, Prop } from 'xbell/decorators';


@Test()
class TestCase {
  @Prop() ctx: Context;

  @Viewport({ width: 1300, height: 1000 })
  @Expect.ToMatchSnapshot({ name: 'xbell-homepage' })
  @Expect.NoPageError()
  async testSnapshot() {
    const { page, expect } = this.ctx;
    await this.ctx.page.goto('https://x-bell.github.io/xbell/');
    await expect(page.queryElementByClass('features_t9lD')).toMatchSnapshot({ name: 'features' });
  }
}

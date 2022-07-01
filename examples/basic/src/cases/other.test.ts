import { Group, Case, Expect, RunEnvs, Inject, Context, sleep, Viewport } from 'xbell';

@Group('其它测试')
export class OtherTestGroup {
  @Inject()
  ctx: Context;

  @Case('打开xbell官网，截图')
  @Viewport({ width: 1300, height: 1000 }) // 指定该 case 窗口大小为 1300 * 1000
  @RunEnvs(['prod']) // 只运行一个环境
  @Expect.ToMatchSnapshot({ name: '全窗口' }) // 保存快照，并为下一次 case 运行做对比
  @Expect.NoPageError() // 页面无报错
  async testSnapshot() {
    const { page, expect } = this.ctx;
    await this.ctx.page.goto('https://x-bell.github.io/xbell/');
    await expect(page.queryByClass('features_t9lD')).toMatchSnapshot({ name: '功能介绍' });
  }
}

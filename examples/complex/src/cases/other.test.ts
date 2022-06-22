import { Group, Case, Expect, RunEnvs, Inject, Context, sleep, Viewport } from 'xbell';
import { XBellHomePage } from '../pages/XBellHome';

@Group('其它测试')
export class OtherTestGroup {
  @Inject()
  ctx: Context;

  @Inject()
  xbellHomePage: XBellHomePage;

  @Case('打开xbell官网，截图')
  @Viewport({ width: 1300, height: 1000 }) // 指定该 case 窗口大小为 1300 * 1000
  @RunEnvs(['prod']) // 只运行一个环境
  @Expect.SnapshotMatch() // 保存快照，并为下一次 case 运行做对比
  @Expect.NoPageError() // 页面无报错
  async testSnapshot() {
    await this.xbellHomePage.openPage();
  }
}

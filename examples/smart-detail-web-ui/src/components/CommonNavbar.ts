import { Inject, Context, sleep } from 'xbell';


const ClassName = {
  AppBar: '.MuiAppBar-root',
  Avatar: '.MuiAvatar-root'
};

export class CommonNavbar {
  @Inject()
  ctx: Context;

  async openQydsHomepage() {
    await this.ctx.page.goto(this.ctx.envConfig.SITE_ORIGIN);
  }
  
  async clickDetail() {
    // 注意：一般弹层不在 root 下
    await this.ctx.page.locator('text=智能详情').click();
  }
}
import { Inject, Context, sleep } from 'xbell';


const ClassName = {
  AppBar: '.MuiAppBar-root',
  Avatar: '.MuiAvatar-root'
};

export class CommonHeader {
  @Inject()
  ctx: Context;

  async clickAvatar() {
    const avatarClass = `${ClassName.AppBar} ${ClassName.Avatar}`;
    // 网页组件问题，刚开始渲染还不可点击，可适当加上延时，就像人工测试一样（但一定是用户可接受范围内的）
    await sleep(1000);
    await this.ctx.page.locator(avatarClass).click();
  }

  async clickLogout() {
    // 注意：一般弹层不在 root 下
    await this.ctx.page.locator('text=退出账号').click();
  }
}
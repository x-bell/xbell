import { Inject, Context } from 'xbell';

export class LoginPage {
  @Inject()
  ctx: Context;

  get iframe() {
    return this.ctx.page.frameLocator('#sso-source');
  }
  
  async openPage() {
    await this.ctx.page.goto(this.ctx.envConfig.SITE_ORIGIN + '/sso');
  }

  async inputUsername(username: string) {
    if (!!this.ctx.page.locator('text="切换为账号密码登录"')) {
      await this.ctx.page.locator('.g-auth-other-way-switch-login__content').click();
    }
    await this.ctx.page.locator('input[placeholder="输入手机号码"]').fill(username);
  }

  async inputPassword(password: string) {
    await this.ctx.page.locator('input[placeholder="输入6-30位密码"]').fill(password);
  }

  async clickSubmit() {
    await this.ctx.page.locator('button[type=submit]').click();
  }

  // async waitForSuccessToast() {
  //   await this.ctx.page.locator('text=登录成功');
  // }

  async selectOrg(orgId: string) {
    await this.ctx.page.locator('text=' + 'ID：' + orgId).click();
  } 


}
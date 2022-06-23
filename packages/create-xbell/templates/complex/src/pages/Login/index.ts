import { Inject, Context, Init } from 'xbell';

export class LoginPage {
  @Inject()
  ctx: Context;
  
  async openPage() {
    await this.ctx.page.goto(this.ctx.envConfig.SITE_ORIGIN + '/login');
  }

  async inputUsername(username: string) {
    await this.ctx.page.locator('#username').fill(username);
  }

  async inputPassword(password: string) {
    await this.ctx.page.locator('#password').fill(password);
  }

  async clickSubmit() {
    await this.ctx.page.locator('button[type=submit]').click();
  }

  async waitForSuccessToast() {
    await this.ctx.page.locator('text=登录成功');
  }
}
import { Group, Data, Inject, Case, Context, Sleep } from 'xbell';
import { Account, adminAccount } from '../data/account';
import { LoginPage } from '../pages/Login';
import { CommonHeader } from '../components/CommonHeader';

@Group('登录测试')
export class LoginTestGroup {
  @Inject()
  ctx: Context;

  // 注入页面对象
  @Inject()
  loginPage: LoginPage;

  @Inject()
  header: CommonHeader;

  @Case('qyds账号登录')
  @Data(adminAccount) // 注入多套环境的数据，每个环境该 case 都会执行一遍
  @Sleep(1000) // 停一秒看一眼（非必需，可移除）
  async testAdminLoginSuccess(@Data.Param() account: Account) {
    await this.loginPage.openPage();
    await this.loginPage.inputUsername(account.username);
    await this.loginPage.inputPassword(account.password);
    await this.loginPage.clickSubmit();
    
    await this.ctx.page.waitForURL(/home/);
  }
}
import { Group, Data, BatchData, Inject, Case, Context, sleep, Sleep } from 'xbell';
import { Account, adminAccount, memberAccounts } from '../data/account';
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

  @Case('单个管理员账户登录')
  @Data(adminAccount) // 注入多套环境的数据，每个环境该 case 都会执行一遍
  @Sleep(1000) // 停一秒看一眼（非必需，可移除）
  async testAdminLoginSuccess(@Data.Param() account: Account) {
    await this.loginPage.openPage();
    await this.loginPage.inputUsername(account.username);
    await this.loginPage.inputPassword(account.password);
    await this.loginPage.clickSubmit();
    await this.loginPage.waitForSuccessToast();
    await this.ctx.page.waitForURL(/homepage/);
  }

  @Case('多个普通账户登录')
  @BatchData(memberAccounts) // 注入多套环境的列表数据，同一个环境下，该 case 会执行 memberAccounts.length 遍
  async testMembersLoginSuccess(@BatchData.Param() account: Account) {
    await this.loginPage.openPage();
    await this.loginPage.inputUsername(account.username);
    await this.loginPage.inputPassword(account.password);
    await this.loginPage.clickSubmit();
    await this.loginPage.waitForSuccessToast();
    await this.ctx.page.waitForURL(/homepage/);
    await this.header.clickAvatar();
    await this.header.clickLogout();
    // await sleep(1000); // 停一秒看一眼（非必需，可移除）
  }
}
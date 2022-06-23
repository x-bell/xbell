import { Group, Case, Inject, BatchData, Context, sleep, RunEnvs } from 'xbell';
import { contacts, Contact } from '../data/contact';
import { SearchListPage } from '../pages/SearchList';

@Group('搜索测试')
export class SearchListTestGroup {
  @Inject()
  ctx: Context;

  @Inject()
  searchListPage: SearchListPage;

  @Case('错误Case')
  async errorCase() {
    this.ctx.expect(1 + 1).toBe(3);
  }

  @Case('搜索联系人')
  @BatchData(contacts)
  async testSearchContact(@BatchData.Param() contact: Contact) {
    await this.searchListPage.openPage();
    await this.searchListPage.searchBar.inputKeywords(contact.name);
    await this.searchListPage.searchBar.clickSearch();
    const list = await this.searchListPage.list.getCardList();
    // 停一秒看一眼（非必要、可移除）
    await sleep(1000);
    const firstItem = list[0];
    this.ctx.expect(firstItem.name).toBe(contact.name);
  }
}

import { Context, Inject } from 'xbell';

const ClassName = {
  Input: '.MuiInput-input',
};

const TestId = {
  SearchIcon: 'SearchIcon'
};

export class SearchBar {
  @Inject()
  ctx: Context;

  async inputKeywords(keywords: string) {
    await this.ctx.page.locator(ClassName.Input).fill(keywords);
  }

  async clickSearch() {
    await this.ctx.page.locator('data-testid=' + TestId.SearchIcon).click();
  }
}

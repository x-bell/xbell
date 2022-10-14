import { Context, Inject } from 'xbell';
import { SearchBar } from './search-bar';
import { List } from './list';

export class SearchListPage {
  @Inject()
  ctx: Context;

  @Inject()
  searchBar: SearchBar;

  @Inject()
  list: List;

  async openPage() {
    await this.ctx.page.goto(this.ctx.envConfig.SITE_ORIGIN + '/search-list');
  }
}


import { Fixture, Inject, Page, Locator  } from 'xbell/decorators';


@Fixture()
export class ButtonFixture {
  @Inject()
  private page: Page;

  async click(root: Locator | Page = this.page) {
    await root.locator('biz-button').click();
  }
}

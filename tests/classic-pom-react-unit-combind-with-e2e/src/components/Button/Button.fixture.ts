import { Fixture, Inject, Page, Locator  } from 'xbell';


export class ButtonFixture {
  constructor(protected page: Page) {
    this.page.locateByText('');
  }
}

import { Test, expect, Page, Inject } from 'xbell';

class TestCase {
  @Inject()
  page: Page;

  @Test()
  async testCase() {
    await this.page.goto('https://github.com');
  }
}
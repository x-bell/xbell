import { Test, expect, Page } from 'xbell';

class TestCase {
  page: Page;

  @Test()
  async testCase() {
    this.page.goto('https://www.baidu.com');
  }
}

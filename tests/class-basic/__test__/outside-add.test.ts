import { add } from '../src/add';
import { Test, Page, Inject, expect, Context } from 'xbell';

@Test()
export class TestCase {
  runInNodeJS() {
    expect(add(1, 1)).toBe(2);
  }

  async runInBrowser(@Page.param() page: Page) {
    await page.execute(async () => {
      const { expect } = await import('xbell/browser');
      const { add } = await import('../src/add');
      expect(1, 1).toBe(2);
    });
  }
}

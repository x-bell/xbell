import { Test, TestArguments } from 'xbell';
class OutsideTestCase {
  @Test()
  async testCase({ page, expect }: TestArguments) {
    await page.goto('https://example.com');
    await expect(page).toMatchScreenshot({
      name: 'default-screenshot',
    });
  }
}

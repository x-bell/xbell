import { Test, DisplayName, TestArguments } from 'xbell';

class ExampleTestCase {
  @Test()
  @DisplayName('goto example')
  async goto_example({ page, expect }: TestArguments) {
    await page.goto('https://example.com');
    await expect(page).toMatchScreenshot({
      name: 'default-screenshot',
    });
  }
}

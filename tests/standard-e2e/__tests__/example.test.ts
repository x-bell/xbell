import { test } from 'xbell';

test('goto example.com', async ({ page, expect }) => {
  await page.goto('https://example.com')
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot'
  });
});

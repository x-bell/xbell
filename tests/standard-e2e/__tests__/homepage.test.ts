import { test, expect } from 'xbell';

test('goto example.com', async ({ page }) => {
  await page.goto('https://example.com')
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot'
  });
});

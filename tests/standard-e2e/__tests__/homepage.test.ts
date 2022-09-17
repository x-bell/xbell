import { test, expect } from 'xbell';

test('xbell homepage', async ({ page }) => {
  await page.goto('https://gaoding.com')
  await expect(page).toMatchScreenshot({
    name: 'a'
  });
});

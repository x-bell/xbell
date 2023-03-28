import { test } from 'xbell';

test.browser('main', async ({ page, expect }) => {
  await import('./main');
  await page.waitForLoadState('networkidle')
  await expect(page).toMatchScreenshot({ name: 'main.png' });
});

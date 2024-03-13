import { test } from 'xbell';

test.browser('main', async ({ page, expect }) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  debugger;
  try {
    await import('./main');
  } catch(error) {
    console.log('error', error);
  }
  await page.waitForLoadState('networkidle')
  await expect(page).toMatchScreenshot({ name: 'main.png' });
});

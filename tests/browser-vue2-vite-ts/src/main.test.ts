import { test } from '@xbell/vue2';


test.browser('execute', async ({ page, expect }) => {
  await import ('./main');
  await page.waitForRequestIdle();

  await expect(page.getByText('User')).toBeVisible();
  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'main-screenshot',
  });
});

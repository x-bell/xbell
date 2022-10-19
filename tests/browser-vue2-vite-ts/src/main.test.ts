import { test } from '@xbell/vue2';

test('render app', async ({ page, expect }) => {
  await page.evaluate(async () => {
    await import ('./main');
  });

  await page.waitForLoadState('networkidle');

  await expect(page.getByText('User')).toBeVisible();
  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'main-screenshot',
  });
});

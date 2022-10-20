import { test } from '@xbell/vue2';

test('render', async ({ page, expect }) => {
  await page.evaluate(async ({ mount }) => {
    const { default: UserInfo } = await import('./UserInfo.vue');
    mount(UserInfo, {
      username: 'xlianghang',
    });
  });

  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'user-info-screenshot',
  });
});

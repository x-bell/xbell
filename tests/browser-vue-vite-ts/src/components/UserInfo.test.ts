import { test } from 'xbell';

test('render user info component', async ({ page, expect }) => {
  await page.goto('https://github.com', {
    mockHTML: '<div id="app"></div>'
  });

  await page.evaluate(async () => {
    const { default: UserInfo } = await import('./UserInfo.vue');
    const { createApp } = await import('vue');
    createApp(UserInfo, {
      username: 'xlianghang',
    }).mount('#app');
  });

  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'user-info-screenshot',
  });
});

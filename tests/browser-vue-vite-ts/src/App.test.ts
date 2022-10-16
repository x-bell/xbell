import { test } from 'xbell';

test('render app', async ({ page, expect }) => {
  await page.goto('https://github.com', {
    html: '<div id="app"></div>'
  });

  await page.evaluate(async () => {
    const { default: UserInfo } = await import('./App.vue');
    const { createApp } = await import('vue');
    createApp(UserInfo).mount('#app');
  });

  await page.waitForLoadState('networkidle');

  await expect(page.getByText('User')).toBeVisible();
  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'app-screenshot',
  });
});

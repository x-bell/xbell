import { test, expect } from 'xbell';

test('render user info', async ({ page }) => {

  await page.goto('https://gd69519309.my-fat.gaoding.com/', {
    html: '<div id="app"></div>'
  });

  await page.evaluate(async () => {
    const { default: UserInfo } = await import('./UserInfo.vue');
    const { createApp } = await import('vue');
    createApp(UserInfo).mount('#app');
  });


  await page.waitForLoadState('networkidle');
  const isVisible = await page.locateByText('凉寒').isVisible();

  expect(isVisible).toBe(true);
});

import { test as basic } from '@xbell/vue2';

const test = basic
  .extendBrowser(async ({ mount }) => {
    const { default: App } = await import('./App.vue');
    mount(App);
    return {
      mount,
    }
  });

test('render', async ({ page, expect }) => {
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('User')).toBeVisible();
  await expect(page.getByText('Hang Liang')).toBeVisible();
});

test('screenshot', async ({ page, expect }) => {
  await expect(page).toMatchScreenshot({
    name: 'app-screenshot',
  });
});


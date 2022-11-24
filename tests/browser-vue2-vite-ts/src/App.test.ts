import { test as basic } from '@xbell/vue2';

const test = basic
  .browser.extend(async (args) => {
    const { default: App } = await import('./App.vue');
    args.mount(App);
    return args;
  });

test('render', async ({ page, expect }) => {
  await page.waitForRequestIdle();
  // await new Promise(r => setTimeout(r, 8000));
  await expect(page.getByText('User')).toBeVisible();
  await expect(page.getByText('Hang Liang')).toBeVisible();
});

test('screenshot', async ({ page, expect }) => {
  await page.waitForRequestIdle();
  await expect(page).toMatchScreenshot({
    name: 'app-screenshot',
  });
});

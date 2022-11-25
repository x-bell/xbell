import { test } from '@xbell/vue2';

test.browser('render', async ({ page, expect, mount }) => {
  const { default: UserInfo } = await import('./UserInfo.vue');
  mount(UserInfo, {
    props: {
      username: 'xlianghang',
    }
  });
  await page.waitForRequestIdle();
  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'user-info-screenshot',
  });
});

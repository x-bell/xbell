import { test } from '@xbell/vue2';

test.browser('render', async ({ page, expect, mount }) => {
  const { defineComponent } = await import('vue');
  const { default: UserInfo } = await import('./UserInfo.vue');
  mount(defineComponent({
    setup() {
      return () => (
        <UserInfo username="xlianghang" />
      )
    }
  }));

  await page.waitForRequestIdle();
  await expect(page.getByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'user-info-screenshot',
  });
});

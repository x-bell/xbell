import { test } from 'xbell';

test('render app', async ({ page, expect }) => {
  await page.goto('https://github.com', {
    html: '<div id="app"></div>'
  });

  await page.evaluate(async () => {
    await import ('./main');
  });

  await page.waitForLoadState('networkidle');

  await expect(page.locateByText('User')).toBeVisible();
  await expect(page.locateByText('Hang Liang')).toBeVisible();
  await expect(page).toMatchScreenshot({
    name: 'main-screenshot',
  });
});

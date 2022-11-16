import { test } from 'xbell';

test('goto example.com', async ({ page, expect }) => {
  await page.goto('https://example.com');
  // no error
  await page.get('.xx').first().getByClass('xx');
  // await page.get('.xx').first().getByClass('xx').click();
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot'
  });
});

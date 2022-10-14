import { expect, test } from 'xbell';

test('run in browser', async ({
  page
}) => {
  await page.goto('https://my-local.com', { html: '<div id="root"></div>'});
  const ret = page.evaluate(async () => {
    const { add } = import('./add')
    return add(1, 1);
  });
  expect(ret).toBe(2);
});

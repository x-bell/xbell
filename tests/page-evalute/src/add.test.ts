import { test, expect } from 'xbell';

const sleep = () => new Promise(resolve => setTimeout(resolve, 115000));


test('#inside: expect in nodejs', async ({ page }) => {
  await page.goto('https://www.baidu.com', {
    mockHTML: '<div id="root">nihao</div>'
  });

  const result = await page.evaluate(async () => {
    const { add } = await import('./add');
    return add(1, 1);
  });
  expect(result).toBe(2);
  await sleep();
});

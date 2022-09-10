import { test, expect } from 'xbell';

// @ts-ignore
test.browser('#outside: expect in browser', async ({ page }) => {
  // await page.execute(async () => {
  //   const { expect } = await import('xbell/browser');
  //   const { add } = await import('../src/add');
  //   expect(add(1, 1)).toBe(2);
  // });
});

test('#outside: expect in nodejs', async ({ page }) => {
  
});

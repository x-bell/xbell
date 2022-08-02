import { it, expect } from 'xbell';


it('#inside: expect in browser', async ({ page }) => {
  await page.execute(async () => {
    const { expect } = await import('xbell/browser');
    const { add } = await import('./add');
    expect(add(1, 1)).toBe(2);
  });
});

it('#inside: expect in nodejs', async ({ page }) => {
  const result = await page.execute(async () => {
    const { add } = await import('./add');
    return add(1, 1);
  });
  expect(result).toBe(2);
});

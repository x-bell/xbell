import { it, expect } from 'xbell';
import { add } from '../src/add';


it('#outside: expect in browser', async ({ page }) => {
  await page.execute(async () => {
    const { expect } = await import('xbell/browser');
    const { add } = await import('../src/add');
    expect(add(1, 1)).toBe(2);
  });
});

it('#outside: expect in nodejs', async ({ page }) => {
  const result = await page.execute(async () => {
    const { add } = await import('../src/add');
    return add(1, 1);
  });
  expect(result).toBe(2);
});

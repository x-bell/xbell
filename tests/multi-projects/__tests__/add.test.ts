import { test } from 'xbell';


test.browser('add', async ({ expect }) => {
  const { add } = await import('../src/add');
  expect(add(1, 1)).toBe(2);
});


import { describe, test } from 'xbell';

describe.only('desc-only-1', () => {
  test.browser.skip('skip: doesn\'t work', ({ expect }) => {
    expect(1).toBe(2);
  });
});


test.only('test-only-1', ({ expect }) => {
  expect(1).toBe(1);
});

test('normal-1', ({ expect }) => {
  expect(1).toBe(2);
});

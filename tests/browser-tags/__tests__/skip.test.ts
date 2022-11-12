import { describe, test } from 'xbell';

describe.skip('desc-skip-1', () => {
  test.browser.only('only: doesn\'t work', ({ expect }) => {
    expect(1).toBe(2);
  });
});


test.skip('test-skip-1', ({ expect }) => {
  expect(1).toBe(2);
});

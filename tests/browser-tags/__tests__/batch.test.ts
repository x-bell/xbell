import { test } from 'xbell';

test.browser.batch([1, 2, 3])
  ('one case: number', ({ expect, item, index }) => {
    expect(item).toBe(index + 1);
  });


  test.browser.batch([{ key: 'key1' }, { key: 'key2' }])
  ('one case: object', ({ expect, item, index }) => {
    expect(item).toEqual({
      key: `key${index+1}`,
    });
  });


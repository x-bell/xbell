import { test } from 'xbell';

test.browser.each([1, 2, 3])
  ((item) => `case: ${item}`, ({ expect, item, index }) => {
    expect(item).toBe(index + 1);
  });

test.browser.each([{ key: 'key1' }, { key: 'key2' }])
  ((item) => item.key, ({ expect, item, index }) => {
    expect(item).toEqual({
      key: `key${index+1}`,
    });
  });

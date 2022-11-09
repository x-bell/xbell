import { test } from 'xbell';

test.browser.mock('./add', async ({ importActual, fn }) => {
  const { add, copyObject } = await importActual<typeof import('./add')>('./add')
  return {
    add: fn(add),
    copyObject: fn(copyObject),
  };
});

test.browser('mocking modules: number', async ({ expect }) => {
  const { add } = await import('./add');
  expect(add(1, 1)).toBe(2);
  expect(add).toHaveBeenCalled();
  expect(add).toHaveBeenCalledWith(1, 1);
  expect(add).toHaveReturnedWith(2);
});

test.browser('mocking modules: object', async ({ expect }) => {
  const { copyObject } = await import('./add');
  expect(copyObject({
    key: {},
  })).toEqual({
    key: {},
  });
  expect(copyObject).toHaveBeenCalled();
  expect(copyObject).toHaveBeenCalledWith({
    key: {},
  });
  expect(copyObject).toHaveReturnedWith({
    key: {},
  });
});

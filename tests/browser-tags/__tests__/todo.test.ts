import { describe, test } from 'xbell';

describe.todo('desc-todo-1', () => {
  test.browser.only('only: doesn\'t work', ({ expect }) => {
    expect(1).toBe(2);
  });
});


test.todo('test-todo-1', ({ expect }) => {
  expect(1).toBe(2);
});

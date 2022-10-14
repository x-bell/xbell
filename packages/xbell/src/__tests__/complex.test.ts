import { test, expect } from '..';


test('complex:1', () => {
  console.log('complex:1:inner');
  expect(1 + 1).toBe(2)
});

test('complex:2', () => {
  console.log('complex:2:inner');
  expect(1 + 1).toBe(2);
});

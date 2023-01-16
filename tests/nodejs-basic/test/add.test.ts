import { it, expect } from 'xbell';
import { add } from '../src/add';

it('add', () => {
  expect(add(1, 1)).toBe(2);
});

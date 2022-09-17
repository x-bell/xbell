import { test } from 'node:test';
import { equal } from 'node:assert';
import { formatError } from '../src/index';
import { throwError } from './fixture'

test('format', () => {
  try {
    throwError()
  } catch(err) {
    const formatResult = formatError(err);
    const expectResult = `  1 | export function throwError() {
  2 |   // ...
> 3 |   throw new Error('a error');
              ^
  4 | }
  5 | `;
    equal(formatResult, expectResult);
  }
});

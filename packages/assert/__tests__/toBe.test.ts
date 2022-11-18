import { format } from '@xbell/format';
import { expect, test } from 'xbell';
import { expect as innerExpect } from '../src';

test('#toBe: does not throw', () => {
  innerExpect('a').not.toBe('b');
  innerExpect('a').toBe('a');
  innerExpect(1).not.toBe(2);
  innerExpect(1).toBe(1);
  innerExpect(null).not.toBe(undefined);
  innerExpect(null).toBe(null);
  innerExpect(undefined).toBe(undefined);
  innerExpect(NaN).toBe(NaN);
  innerExpect(BigInt(1)).not.toBe(BigInt(2));
  innerExpect(BigInt(1)).not.toBe(1);
  innerExpect(BigInt(1)).toBe(BigInt(1));
});

[
  [1, 2],
  [true, false],
  [() => {}, () => {}],
  [{}, {}],
  [{a: 1}, {a: 1}],
  [{a: 1}, {a: 5}],
  // [
  //   {a: () => {}, b: 2},
  //   {a: expect.any(Function), b: 2},
  // ],
  [{a: undefined, b: 2}, {b: 2}],
  [new Date('2020-02-20'), new Date('2020-02-20')],
  [new Date('2020-02-21'), new Date('2020-02-20')],
  [/received/, /expected/],
  [Symbol('received'), Symbol('expected')],
  [new Error('received'), new Error('expected')],
  ['abc', 'cde'],
  ['painless JavaScript testing', 'delightful JavaScript testing'],
  ['', 'compare one-line string to empty string'],
  ['with \ntrailing space', 'without trailing space'],
  ['four\n4\nline\nstring', '3\nline\nstring'],
  [[], []],
  [null, undefined],
  [-0, +0],
].forEach(([a, b], idx) => {
  test(`fails for: ${format(a)} and ${format(b)}`, async () => {
    await expect(() => {
      innerExpect(a).toBe(b);
    }).toThrowErrorMatchingSnapshot({
      name: `error-${idx}`,
    });
    await expect(() => {
      expect(a).not.toBe(a);
    }).toThrowErrorMatchingSnapshot({
      name: `error-not-${idx}`,
    });
  });
});

import { format } from '@xbell/format';
import { expect, test } from 'xbell';
// import { test } from './internal-test';

// const snapshotError = genSnapshotError('toBe.test.ts');

(async () => {
  test('#toBe: does not throw', () => {
    expect('a').not.toBe('b');
    expect('a').toBe('a');
    expect(1).not.toBe(2);
    expect(1).toBe(1);
    expect(null).not.toBe(undefined);
    expect(null).toBe(null);
    expect(undefined).toBe(undefined);
    expect(NaN).toBe(NaN);
    expect(BigInt(1)).not.toBe(BigInt(2));
    expect(BigInt(1)).not.toBe(1);
    expect(BigInt(1)).toBe(BigInt(1));
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
    test(`fails for: ${format(a)} and ${format(b)}`, () => {
      expect(() => {
        expect(a).toBe(b);
      })();
      snapshotError(`error-${idx}`, () => {
        
      });
      snapshotError(`error-not-${idx}`, () => {
        expect(a).not.toBe(a);
      })
    });
  });

})();

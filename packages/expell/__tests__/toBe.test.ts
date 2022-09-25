import { expell, fn } from '../dist';
import { format } from '@xbell/format';
import { test, genSnapshotError } from './internal-test';

const snapshotError = genSnapshotError('toBe.test.ts');

(async () => {
  test('#toBe: does not throw', () => {
    expell('a').not.toBe('b');
    expell('a').toBe('a');
    expell(1).not.toBe(2);
    expell(1).toBe(1);
    expell(null).not.toBe(undefined);
    expell(null).toBe(null);
    expell(undefined).toBe(undefined);
    expell(NaN).toBe(NaN);
    expell(BigInt(1)).not.toBe(BigInt(2));
    expell(BigInt(1)).not.toBe(1);
    expell(BigInt(1)).toBe(BigInt(1));
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
      snapshotError(`error-${idx}`, () => {
        expell(a).toBe(b);
      });
      snapshotError(`error-not-${idx}`, () => {
        expell(a).not.toBe(a);
      })
    });
  });

})();

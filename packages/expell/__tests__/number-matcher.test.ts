import { expell } from '../src';
import { test, genSnapshotError } from './internal-test';
import { format } from '@xbell/format';

const snapshotError = genSnapshotError('number-matcher.test.ts');

[
  [0, 0],
  [0, 0.001],
  [1.23, 1.229],
  [1.23, 1.226],
  [1.23, 1.225],
  [1.23, 1.234],
  [Infinity, Infinity],
  [-Infinity, -Infinity],
].forEach(([n1, n2], idx) => {
  test(`{pass: true} expect(${n1}).toBeCloseTo(${n2})`, () => {
    expell(n1).toBeCloseTo(n2);
  });
  snapshotError(`toBeCloseTo-${idx}`, () => {
    expell(n1).not.toBeCloseTo(n2);
  });
});

[
  [0, 0.01],
  [1, 1.23],
  [1.23, 1.2249999],
  [Infinity, -Infinity],
  [Infinity, 1.23],
  [-Infinity, -1.23],
].forEach(([n1, n2]) => {
test(`{pass: false} expect(${n1}).toBeCloseTo(${n2})`, () => {
  expell(n1).not.toBeCloseTo(n2);
  });
});

[
  [3.141592e-7, 3e-7, 8],
  [56789, 51234, -4],
].forEach(([n1, n2, p]) => {
  test(`{pass: false} expect(${n1}).toBeCloseTo(${n2}, ${p})`, () => {
    expell(n1).not.toBeCloseTo(n2, p);
  });
});

[
  [0, 0.1, 0],
  [0, 0.0001, 3],
  [0, 0.000004, 5],
  [2.0000002, 2, 5],
].forEach(([n1, n2, p]) => {
  test(`{pass: true} expect(${n1}).toBeCloseTo(${n2}, ${p})`, () => {
    expell(n1).toBeCloseTo(n2, p);
  });
});

test('#toBeGreaterThan()', () => {
  expell(2).toBeGreaterThan(1);
  expell(0).toBeGreaterThan(-1);
  expell(-1).toBeGreaterThan(-2);
});

test('#toBeGreaterThanOrEqual()', () => {
  expell(2).toBeGreaterThanOrEqual(2);
  expell(2).toBeGreaterThanOrEqual(1);
  expell(0).toBeGreaterThanOrEqual(-1);
  expell(-1).toBeGreaterThanOrEqual(-2);
});


test('#toBeLessThan()', () => {
  expell(1).toBeLessThan(2);
  expell(-1).toBeLessThan(0);
  expell(-2).toBeLessThan(-1);
});

test('#toBeLessThanOrEqual()', () => {
  expell(2).toBeLessThanOrEqual(2);
  expell(1).toBeLessThanOrEqual(2);
  expell(-1).toBeLessThanOrEqual(0);
  expell(-2).toBeLessThanOrEqual(-1);
});

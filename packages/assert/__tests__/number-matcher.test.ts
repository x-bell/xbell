import { expect as innerExpect } from '../src';
import { expect, test } from 'xbell';

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
    innerExpect(n1).toBeCloseTo(n2);
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
    innerExpect(n1).not.toBeCloseTo(n2);
  });
});

[
  [3.141592e-7, 3e-7, 8],
  [56789, 51234, -4],
].forEach(([n1, n2, p]) => {
  test(`{pass: false} expect(${n1}).toBeCloseTo(${n2}, ${p})`, () => {
    innerExpect(n1).not.toBeCloseTo(n2, p);
  });
});

[
  [0, 0.1, 0],
  [0, 0.0001, 3],
  [0, 0.000004, 5],
  [2.0000002, 2, 5],
].forEach(([n1, n2, p]) => {
  test(`{pass: true} expect(${n1}).toBeCloseTo(${n2}, ${p})`, () => {
    innerExpect(n1).toBeCloseTo(n2, p);
  });
});
[
  [2, -1],
  [0, -1],
  [-1, -2]
].forEach(([n1, n2], idx) => {
  test(`{pass: true} expect(${n1}).toBeGreaterThan(${n2})`, async () => {
    innerExpect(n1).toBeGreaterThan(n2);

    // snap
    await expect(() => {
      innerExpect(n1).not.toBeGreaterThan(n2);
    }).toThrowErrorMatchingSnapshot({
      name: `toBeGreaterThan-error-not-${idx}`,
    });

    // snap
    await expect(() => {
      innerExpect(n2).toBeGreaterThan(n1);
    }).toThrowErrorMatchingSnapshot({
      name: `toBeGreaterThan-error-${idx}`,
    });
  });
});

test('#toBeLessThan()', () => {
  innerExpect(1).toBeLessThan(2);
  innerExpect(-1).toBeLessThan(0);
  innerExpect(-2).toBeLessThan(-1);
});

test('#toBeLessThanOrEqual()', () => {
  innerExpect(2).toBeLessThanOrEqual(2);
  innerExpect(1).toBeLessThanOrEqual(2);
  innerExpect(-1).toBeLessThanOrEqual(0);
  innerExpect(-2).toBeLessThanOrEqual(-1);
});

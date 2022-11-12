import { expect as innerExpect } from '../src';
import { expect } from 'xbell';
import { test, genSnapshotError } from './internal-test';

const snapshotError = genSnapshotError('toBeGreaterThanOrEqual.test.ts');

const list = [
  [2, 1],
  [0, -1],
  [-1, -2],
  [2, 2],
];
for (let idx = 0; idx < list.length; idx++) {
  const [n1, n2] = list[idx];
  test(`{pass: true} expect(${n1}).toBeGreaterThanOrEqual(${n2})`, async () => {
    innerExpect(n1).toBeGreaterThanOrEqual(n2);

    await innerExpect(Promise.resolve(n1)).resolves.toBeGreaterThanOrEqual(n2);

    await innerExpect(Promise.reject<number>(n1)).rejects.toBeGreaterThanOrEqual(n2);

    await innerExpect(Promise.resolve<number>(n1)).resolves.toBeGreaterThanOrEqual(n2);

    // snap
    expect(() => {
      innerExpect(n1).not.toBeGreaterThanOrEqual(n2);
    }).toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-not-${idx}`,
    });

    await expect(async () => {
      await innerExpect(Promise.resolve<number>(n1)).resolves.not.toBeGreaterThanOrEqual(n2);
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-resolves-not-${idx}`,
    });

    await expect(async () => {
      await innerExpect(Promise.reject<number>(n1)).rejects.not.toBeGreaterThanOrEqual(n2);
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-rejects-not-${idx}`,
    });

    if (n1 != n2) {
      // snap
      await expect(async () => {
        innerExpect(n2).toBeGreaterThanOrEqual(n1);
      }).toMatchJavaScriptSnapshot({
        name: `error-${idx}`,
      });

      await expect(async () => {
        await innerExpect(Promise.resolve<number>(n2)).resolves.toBeGreaterThanOrEqual(n1);
      }).toMatchJavaScriptSnapshot({
        name: `error-resolves-${idx}`,
      });

      await expect(async () => {
        await innerExpect(Promise.reject<number>(n2)).rejects.toBeGreaterThanOrEqual(n1);
      }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
        name: `error-rejects-${idx}`,
      });
    }
  });
}

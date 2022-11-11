import { expect } from '../src';
import { test, genSnapshotError } from './internal-test';

const snapshotError = genSnapshotError('toBeGreaterThan.test.ts');

(async () => {
  const list = [
    [2, 1],
    [0, -1],
    [-1, -2],
  ];
  for (let idx = 0; idx < list.length; idx++) {
    const [n1, n2] = list[idx];
    await test(`{pass: true} expect(${n1}).toBeGreaterThan(${n2})`, async () => {
      expect(n1).toBeGreaterThan(n2);

      await expect(Promise.resolve(n1)).resolves.toBeGreaterThan(n2);

      await expect(Promise.reject<number>(n1)).rejects.toBeGreaterThan(n2);

      await expect(Promise.resolve<number>(n1)).resolves.toBeGreaterThan(n2);
      
      // snap
      snapshotError(`error-not-${idx}`, () => {
        expect(n1).not.toBeGreaterThan(n2);
      });

      await snapshotError(`error-resolves-not-${idx}`, async () => {
        await expect(Promise.resolve<number>(n1)).resolves.not.toBeGreaterThan(n2);
      });

      await snapshotError(`error-rejects-not-${idx}`, async () => {
        await expect(Promise.reject<number>(n1)).rejects.not.toBeGreaterThan(n2);
      });

      if (n1 != n2) {
        // snap
        snapshotError(`error-${idx}`, async () => {
          expect(n2).toBeGreaterThan(n1);
        });

        await snapshotError(`error-resolves-${idx}`, async () => {
          await expect(Promise.resolve<number>(n2)).resolves.toBeGreaterThan(n1);
        });

        await snapshotError(`error-rejects-${idx}`, async () => {
          await expect(Promise.reject<number>(n2)).rejects.toBeGreaterThan(n1);
        });
      }
    });
  }
})();

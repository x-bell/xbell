import { expell } from '../dist/index.mjs';
import { test, genSnapshotError } from './internal-test';

const snapshotError = genSnapshotError('toBeGreaterThanOrEqual.test.ts');

(async () => {
  const list = [
    [2, 1],
    [0, -1],
    [-1, -2],
    [2, 2],
  ];
  for (let idx = 0; idx < list.length; idx++) {
    const [n1, n2] = list[idx];
    await test(`{pass: true} expect(${n1}).toBeGreaterThanOrEqual(${n2})`, async () => {
      expell(n1).toBeGreaterThanOrEqual(n2);

      await expell(Promise.resolve(n1)).resolves.toBeGreaterThanOrEqual(n2);

      await expell(Promise.reject<number>(n1)).rejects.toBeGreaterThanOrEqual(n2);

      await expell(Promise.resolve<number>(n1)).resolves.toBeGreaterThanOrEqual(n2);
      
      // snap
      snapshotError(`error-not-${idx}`, () => {
        expell(n1).not.toBeGreaterThanOrEqual(n2);
      });

      await snapshotError(`error-resolves-not-${idx}`, async () => {
        await expell(Promise.resolve<number>(n1)).resolves.not.toBeGreaterThanOrEqual(n2);
      });

      await snapshotError(`error-rejects-not-${idx}`, async () => {
        await expell(Promise.reject<number>(n1)).rejects.not.toBeGreaterThanOrEqual(n2);
      });

      if (n1 != n2) {
        // snap
        snapshotError(`error-${idx}`, async () => {
          expell(n2).toBeGreaterThanOrEqual(n1);
        });

        await snapshotError(`error-resolves-${idx}`, async () => {
          await expell(Promise.resolve<number>(n2)).resolves.toBeGreaterThanOrEqual(n1);
        });

        await snapshotError(`error-rejects-${idx}`, async () => {
          await expell(Promise.reject<number>(n2)).rejects.toBeGreaterThanOrEqual(n1);
        });
      }
    });
  }
})();

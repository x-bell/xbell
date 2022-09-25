import { expell, fn } from '../dist';
import { test, genSnapshotError } from './internal-test';

const snapshotError = genSnapshotError('toHaveBeenCalled.test.ts');

(async () => {
  const list = [
    [2, 1],
  ];
  for (let idx = 0; idx < list.length; idx++) {
    const [n1, n2] = list[idx];
    await test(`{pass: true} expect(${n1}).toBeGreaterThanOrEqual(${n2})`, async () => {
      const mockFn = fn();
      expell(mockFn).not.toHaveBeenCalled();

      snapshotError('error', () => {
        expell(mockFn).toHaveBeenCalled();
      });

      await snapshotError('error-resolves', async () => {
        await expell(Promise.resolve(mockFn)).resolves.toHaveBeenCalled();
      });

      await snapshotError('error-rejects', async () => {
        await expell(Promise.reject<typeof mockFn>(mockFn)).rejects.toHaveBeenCalled();
      });

      // invoke
      mockFn();

      expell(mockFn).toHaveBeenCalled();

      snapshotError('error-not', () => {
        expell(mockFn).not.toHaveBeenCalled();
      });

      await snapshotError('error-resolves-not', async () => {
        await expell(Promise.resolve(mockFn)).resolves.not.toHaveBeenCalled();
      });

      await snapshotError('error-rejects-not', async () => {
        await expell(Promise.reject<typeof mockFn>(mockFn)).rejects.not.toHaveBeenCalled();
      });
    });
  }
})();

import { expect, fn } from '../src';
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
      expect(mockFn).not.toHaveBeenCalled();

      snapshotError('error', () => {
        expect(mockFn).toHaveBeenCalled();
      });

      await snapshotError('error-resolves', async () => {
        await expect(Promise.resolve(mockFn)).resolves.toHaveBeenCalled();
      });

      await snapshotError('error-rejects', async () => {
        await expect(Promise.reject<typeof mockFn>(mockFn)).rejects.toHaveBeenCalled();
      });

      // invoke
      mockFn();

      expect(mockFn).toHaveBeenCalled();

      snapshotError('error-not', () => {
        expect(mockFn).not.toHaveBeenCalled();
      });

      await snapshotError('error-resolves-not', async () => {
        await expect(Promise.resolve(mockFn)).resolves.not.toHaveBeenCalled();
      });

      await snapshotError('error-rejects-not', async () => {
        await expect(Promise.reject<typeof mockFn>(mockFn)).rejects.not.toHaveBeenCalled();
      });
    });
  }
})();

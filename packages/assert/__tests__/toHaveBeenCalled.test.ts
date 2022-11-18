import { expect, test } from 'xbell';
import { expect as innerExpect, fn } from '../src';

const list = [
  [2, 1],
];
for (let idx = 0; idx < list.length; idx++) {
  const [n1, n2] = list[idx];
  await test(`{pass: true} expect(${n1}).toBeGreaterThanOrEqual(${n2})`, async () => {
    const mockFn = fn();
    innerExpect(mockFn).not.toHaveBeenCalled();

    await expect( () => {
      innerExpect(mockFn).toHaveBeenCalled();
    }).toThrowErrorMatchingSnapshot({
      name: 'error',
    });

    await expect(async () => {
      await innerExpect(Promise.resolve(mockFn)).resolves.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingSnapshot({
      name: 'error-resolves',
    });

    await expect(async () => {
      await innerExpect(Promise.reject<typeof mockFn>(mockFn)).rejects.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingSnapshot({
      name: 'error-rejects',
    });

    // invoke
    mockFn();

    innerExpect(mockFn).toHaveBeenCalled();

    await expect(() => {
      innerExpect(mockFn).not.toHaveBeenCalled();
    }).toThrowErrorMatchingSnapshot({
      name: 'error-not',
    });

    await expect(async () => {
      await innerExpect(Promise.resolve(mockFn)).resolves.not.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingSnapshot({
      name: 'error-resolves-not',
    });

    await expect(async () => {
      await innerExpect(Promise.reject<typeof mockFn>(mockFn)).rejects.not.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingSnapshot({
      name: 'error-rejects-not',
    });
  });
}

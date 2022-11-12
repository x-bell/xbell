import { expect, test } from 'xbell';
import { expect as innerExpect, fn } from '../src';
// import { test, genSnapshotError } from './internal-test';

// const snapshotError = genSnapshotError('toHaveBeenCalled.test.ts');

const list = [
  [2, 1],
];
for (let idx = 0; idx < list.length; idx++) {
  const [n1, n2] = list[idx];
  await test(`{pass: true} expect(${n1}).toBeGreaterThanOrEqual(${n2})`, async () => {
    const mockFn = fn();
    innerExpect(mockFn).not.toHaveBeenCalled();

    expect( () => {
      innerExpect(mockFn).toHaveBeenCalled();
    }).toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error',
    });

    await expect(async () => {
      await innerExpect(Promise.resolve(mockFn)).resolves.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error-resolves',
    });

    await expect(async () => {
      await innerExpect(Promise.reject<typeof mockFn>(mockFn)).rejects.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error-rejects',
    });

    // invoke
    mockFn();

    innerExpect(mockFn).toHaveBeenCalled();

    expect(() => {
      innerExpect(mockFn).not.toHaveBeenCalled();
    }).toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error-not',
    });

    await expect(async () => {
      await innerExpect(Promise.resolve(mockFn)).resolves.not.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error-resolves-not',
    });

    await expect(async () => {
      await innerExpect(Promise.reject<typeof mockFn>(mockFn)).rejects.not.toHaveBeenCalled();
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: 'error-rejects-not',
    });
  });
}

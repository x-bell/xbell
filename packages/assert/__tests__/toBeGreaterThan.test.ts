import { expect, test } from 'xbell';
import { expect as innerExpect } from '../src';
// import { test } from './internal-test';

// const snapshotError = genSnapshotError('toBeGreaterThan.test.ts');

const list = [
  [2, 1],
  [0, -1],
  [-1, -2],
];

for (let idx = 0; idx < list.length; idx++) {
  const [n1, n2] = list[idx];
  test(`{pass: true} expect(${n1}).toBeGreaterThan(${n2})`, async () => {
    innerExpect(n1).toBeGreaterThan(n2);

    await innerExpect(Promise.resolve(n1)).resolves.toBeGreaterThan(n2);

    await innerExpect(Promise.reject<number>(n1)).rejects.toBeGreaterThan(n2);

    await innerExpect(Promise.resolve<number>(n1)).resolves.toBeGreaterThan(n2);
    
    try {
    } catch(error) {
      console.log('error', error.stack);
      expect(error.stack).toBe('1');
    }
    // // snap
    expect(() => {
      innerExpect(n1).not.toBeGreaterThan(n2);
    }).toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-not-${idx}`
    });

    await expect(async () => {
      await innerExpect(Promise.resolve<number>(n1)).resolves.not.toBeGreaterThan(n2);
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-resolves-not-${idx}`
    });

    await expect(async () => {
      await innerExpect(Promise.reject<number>(n1)).rejects.not.toBeGreaterThan(n2);
    }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
      name: `error-rejects-not-${idx}`
    });

    if (n1 != n2) {
      // snap
      expect(() => {
        innerExpect(n2).toBeGreaterThan(n1);
      }).toThrowErrorMatchingJavaScriptSnapshot({
        name: `error-${idx}`
      });

      await expect(async () => {
        await innerExpect(Promise.resolve<number>(n2)).resolves.toBeGreaterThan(n1);
      }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
        name: `error-resolves-${idx}`
      });

      await expect(async () => {
        await innerExpect(Promise.reject<number>(n2)).rejects.toBeGreaterThan(n1);
      }).rejects.toThrowErrorMatchingJavaScriptSnapshot({
        name: `error-rejects-${idx}`
      });
    }
  });
}


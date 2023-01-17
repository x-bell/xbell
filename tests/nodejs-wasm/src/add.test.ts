import { test } from 'xbell';

test('wams', async ({ expect }) => {
  const { readFileSync } = await import('node:fs');
  const wasm = await WebAssembly.compile(
    readFileSync(new URL('./add.wasm', import.meta.url)),
  );
  const instance = await WebAssembly.instantiate(wasm);
  const ret = instance.exports.add(1, 1);
  expect(ret).toBe(2);
})
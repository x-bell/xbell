import { test } from 'xbell';

const testAll = test.all.extend(async ({ expect, runtime }) => {
  const { default: wasmURL } = await import('./add.wasm?url');
  const { instance } = await WebAssembly.instantiateStreaming(fetch(wasmURL));
  const ret = instance.exports
  return {
    expect,
  }
})

test.all('add', async ({ expect }) => {
  const { default: wasmURL } = await import('./add.wasm?url');
  const { instance } = await WebAssembly.instantiateStreaming(fetch(wasmURL));
  const ret = instance.exports.add(1, 1)
  expect(ret).toBe(2);
});

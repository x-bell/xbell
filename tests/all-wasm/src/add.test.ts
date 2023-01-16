import { test as basic } from 'xbell';

const test = basic.all.extend(async (args) => {
  console.log('runtime', args.runtime);
  const add = await (async () => {
    if (args.runtime === 'browser') {
      const { default: wasmURL } = await import('./add.wasm?url');
      const { instance } = await WebAssembly.instantiateStreaming(fetch(wasmURL));
      return instance.exports.add;
    };

    const { readFileSync } = await import('node:fs');
    const wasm = await WebAssembly.compile(
      readFileSync(new URL('./add.wasm', import.meta.url)),
    );
    const instance = await WebAssembly.instantiate(wasm);
    return instance.exports.add;
  })();

  return {
    ...args,
    add,
  }
});

test('add', async ({ expect, add, sleep }) => {
  const ret = add(1, 1);
  expect(ret).toBe(2);
});

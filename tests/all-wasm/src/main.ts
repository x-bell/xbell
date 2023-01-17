async function run() {
  const { default: wasmURL } = await import('./add.wasm?url');
  const { instance } = await WebAssembly.instantiateStreaming(fetch(wasmURL));
  const ret = instance.exports.add(1, 1)
  document.write(`${ret} === 2`);
}

run();

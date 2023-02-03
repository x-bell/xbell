import type { RawSourceMap } from 'source-map-js';
import type { SFCDescriptor } from 'vue/compiler-sfc';
import * as compiler from 'vue/compiler-sfc';

export async function genScriptCode({
  descriptor,
  hash
}: {
  descriptor: SFCDescriptor;
  filename: string;
  hash: string;
}): Promise<{
  code: string;
  map?: RawSourceMap;
}> {
  if (!descriptor.script) {
    return {
      code: '',
    }
  }

  const script = compiler.compileScript(descriptor, {
    id: hash,
    isProd: false,
    sourceMap: true,
  })

  const scriptCode = compiler.rewriteDefault(script.content, '_sfc_main');
  return {
    code: scriptCode,
    map: script.map,
  };
}

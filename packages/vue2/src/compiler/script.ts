import type { SFCDescriptor } from 'vue/compiler-sfc';
import * as compiler from 'vue/compiler-sfc';

export async function genScriptCode({
  descriptor,
}: {
  descriptor: SFCDescriptor;
  filename: string;
}): Promise<string> {
  if (!descriptor.script) {
    return ''
  }

  const scriptCode = compiler.rewriteDefault(descriptor.script.content, '_sfc_main');
  return scriptCode;
}

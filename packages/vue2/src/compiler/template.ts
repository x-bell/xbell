import type { SFCDescriptor } from 'vue/compiler-sfc';
import * as compiler from 'vue/compiler-sfc';

export async function genTemplateCode({
  descriptor,
  filename,
}: {
  descriptor: SFCDescriptor;
  filename: string;
}): Promise<string> {
  if (!descriptor.template) {
    return ''
  }

  const templateCode = compiler.compileTemplate({
    source: descriptor.template.content,
    filename,
  })
    .code
    .replace(/var (render|staticRenderFns) =/g, 'var _sfc_$1 =')
    .replace(/(render._withStripped)/, '_sfc_$1');

  return templateCode;
}

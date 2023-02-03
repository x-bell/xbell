import type { SFCDescriptor } from 'vue/compiler-sfc';
import type { RawSourceMap } from 'source-map-js';
import * as compiler from 'vue/compiler-sfc';

export async function genStyleCode({
  descriptor,
  hash,
  hasScoped,
  filename
}: {
  descriptor: SFCDescriptor;
  filename: string;
  hash: string;
  hasScoped: boolean;
}): Promise<{
  code: string;
  map?: RawSourceMap;
}> {
  async function genSetupCode(style: typeof descriptor.styles[number]) {
    const { code: styleCode } = await compiler.compileStyleAsync({
      source: style.content,
      filename,
      id: `data-v-${hash}`,
      scoped: hasScoped,
    })
    return `var style = document.createElement('style');
style.innerHTML = \`${styleCode}\`;
document.head.appendChild(style);
    `;
  }

  const styleCode = (await Promise.all(
    descriptor.styles.map(genSetupCode)
  )).join('\n');

  return {
    code: styleCode,
  };
}
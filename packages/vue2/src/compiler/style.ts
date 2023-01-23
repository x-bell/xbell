import type { SFCDescriptor } from 'vue/compiler-sfc';
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
}): Promise<string> {
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

  const styleCodes = (await Promise.all(
    descriptor.styles.map(genSetupCode)
  )).join('\n');

  return styleCodes;
}
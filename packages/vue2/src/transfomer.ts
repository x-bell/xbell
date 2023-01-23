import type { Transformer } from 'xbell';
import * as compiler from 'vue/compiler-sfc';
import * as crypto from 'node:crypto';
import { NORMALIZE_FUNCTION_CODE } from './compiler/constants';
import { genScriptCode } from './compiler/script';
import { genTemplateCode } from './compiler/template';
import { genStyleCode } from './compiler/style';

export const Vue2Transfomer: Transformer = {
  async process(sourceCode: string, filename: string) {
    const descriptor = compiler.parse({
      source: sourceCode,
      filename,
      sourceMap: true,
    });

    const scriptCode = genScriptCode({
      descriptor,
      filename,
    });

    const templateCode = genTemplateCode({
      descriptor,
      filename,
    });

    const hasScoped = descriptor.styles.some(s => s.scoped);
    const hasCssModules = descriptor.styles.some(s => s.module);
    const hasFunctional =
      descriptor.template && descriptor.template.attrs.functional;

    const hash = crypto
      .createHash('sha256')
      .update(filename)
      .digest('hex')
      .substring(0, 8);

    const normalizerCode =  `/* normalize component */
    var __component__ = /*#__PURE__*/__normalizer(
      _sfc_main,
      _sfc_render,
      _sfc_staticRenderFns,
      ${hasFunctional ? 'true' : 'false'},
      ${hasCssModules ? `_sfc_injectStyles` : `null`},
      ${hasScoped ? JSON.stringify(hash) : 'null'},
      null,
      null
    )`;

    const exportCode = `export default __component__.exports`;
    const styleCode = genStyleCode({
      descriptor,
      filename,
      hash,
      hasScoped,
    });

    const output = [
      NORMALIZE_FUNCTION_CODE,
      styleCode,
      scriptCode,
      templateCode,
      normalizerCode,
      exportCode,
    ];

    const code = output.join('\n');
    return {
      code,
    };
  },
}
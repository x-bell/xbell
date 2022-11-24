import { XBELL_JSX_PRAGMA, XBELL_JSX_PRAGMA_FRAG } from '../constants/xbell';
import { crossEnv } from '../common/cross-env';

export function replaceJSX(code: string) {
  const runtime = crossEnv.get('jsxRuntime');
  const jsxPragma = runtime === 'classic' ? crossEnv.get('jsxPragma') : '_jsx';
  const jsxPragmaFrag = runtime === 'classic' ? crossEnv.get('jsxPragmaFrag') : '_Fragment';
  return code
    .replace(new RegExp(XBELL_JSX_PRAGMA, 'g'), jsxPragma)
    .replace(new RegExp(XBELL_JSX_PRAGMA_FRAG, 'g'), jsxPragmaFrag);
}

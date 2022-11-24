import { XBELL_JSX_PRAGMA, XBELL_JSX_PRAGMA_FRAG } from '../constants/xbell';
import { crossEnv } from '../common/cross-env';

export function replaceJSX(code: string) {
  return code
    .replace(new RegExp(XBELL_JSX_PRAGMA, 'g'), crossEnv.get('jsxPragma'))
    .replace(new RegExp(XBELL_JSX_PRAGMA_FRAG), crossEnv.get('jsxPragmaFrag'))
}

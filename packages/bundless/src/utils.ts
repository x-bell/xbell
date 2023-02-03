import * as path from 'node:path';
import * as fs from 'node:fs';

export function dirname(pathname: string): string {
  const stat = fs.statSync(pathname)
  if (stat.isDirectory()) {
    return pathname;
  }

  return path.dirname(pathname);
}

const JS_REG_EXP = /\.(ts|tsx|js|mjs|cjs|jsx)$/;
const CSS_REG_EXP = /\.(css|less|sass|scss)$/;
const JSON_REG_EXP = /\.json$/;
const ContentType = {
  JavaScript: 'text/javascript;',
  CSS: 'text/css',
  JSON: 'application/json'
} as const;

const CONTENT_TYPE_LIST = [
  {
    match: JS_REG_EXP,
    contentType: ContentType.JavaScript,
  },
  {
    match: CSS_REG_EXP,
    contentType: ContentType.CSS,
  },
  {
    match: JSON_REG_EXP,
    contentType: ContentType.JSON,
  }
] as const;

export function getContentType(filename: string): string {
  // TODO: content-type
  return CONTENT_TYPE_LIST.find(item => item.match.test(filename))?.contentType ?? ''
}

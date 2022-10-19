import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from 'node:url';
import { XBELL_RESOURCE_PLACEHOLDER } from './const.mjs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export function generateHTML(resources) {
  const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8')
  const htmlRet = html.replace(XBELL_RESOURCE_PLACEHOLDER, `
    <script>
      var XBELL_RESOURCES = ${JSON.stringify(resources)}
    </script>
  `);

  return htmlRet;
}

import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from 'node:url';
import glob from 'glob';
import { XBELL_RESOURCE_PLACEHOLDER } from '../lib/const.mjs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const distPath = path.join(__dirname, '../dist');
const libPath = path.join(__dirname, '../lib');

glob('**/*(*.js|*.css)', {
  cwd: distPath
}, (err, filepaths) => {
  const targetJsPath = filepaths.find(filepath => filepath.endsWith('.js'))
  const targetCssPath = filepaths.find(filepath => filepath.endsWith('.css'))
  const jsContent = fs.readFileSync(
    path.join(distPath, targetJsPath),
    'utf-8'
  )
  const cssContent = fs.readFileSync(
    path.join(distPath, targetCssPath),
    'utf-8'
  )
  const rootTag = `<div id="root"></div>`;
  const finalHtml = `
      <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        ${rootTag}
        ${XBELL_RESOURCE_PLACEHOLDER}
        <script>
        ${jsContent}
        </script>
        <style>
        ${cssContent}
        </style>
      </body>
    </html>
    `;

  fs.writeFileSync(
    path.join(libPath, 'template.html'),
    finalHtml,
    'utf-8'
  )
});

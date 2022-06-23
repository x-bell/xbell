const path = require('path');
const fs = require('fs');
const { XBELL_RESOURCE_PLACEHOLDER } = require('./const');


function generateHTML(resources) {
  const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8')
  const htmlRet = html.replace(XBELL_RESOURCE_PLACEHOLDER, `
    <script>
      var XBELL_RESOURCES = ${JSON.stringify(resources)}
    </script>
  `)

  return htmlRet;
}

module.exports = {
  generateHTML
}
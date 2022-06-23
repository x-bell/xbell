import * as fs from 'fs';
import { codeFrameColumns } from '@babel/code-frame';
import StackUtils = require('stack-utils');
import { dim } from 'colors/safe';
import { XBellErrorRecord } from 'xbell-reporter';

const stackUtils = new StackUtils({
  cwd: 'empty',
})


function parseStack(stack: string) {
  const lines = stack.split('\n')
  let firstCodeLine = lines.findIndex(line => line.startsWith('    at '));
  if (firstCodeLine === -1) {
    firstCodeLine = lines.length - 1;
  }
  const message = lines.slice(0, firstCodeLine).join('\n');
  const codeLines = lines.slice(firstCodeLine);
  for (const line of codeLines) {
    const parsed = stackUtils.parseLine(line);
    if (!parsed || !parsed.file || parsed.file.includes('node_module') || parsed.file.includes('node:')) continue;
    // const resolvedFile = path.join(process.cwd(), parsed.file);
    // console.log(' parsed.file',  parsed.file);
    const location = {
      filename: parsed.file,
      column: parsed.column || 0,
      line: parsed.line || 0,

    }
    return {
      location,
      codeLines,
      message,
    }
  }
}

export function parseError(error: Error): XBellErrorRecord | void {
  if (!error.stack) {
    return;
  }

  const stackRet = parseStack(error.stack);
  if (!stackRet) {
    return;
  }
  const { location, codeLines, message } = stackRet;

  if (location) {
    const codeFrame = codeFrameColumns(
      fs.readFileSync(location.filename, 'utf8'),
      {
        start: location
      },
      {
        highlightCode: true,
      }
    )
    console.log()
    console.log('');
    console.log(codeFrame);
    return {
      originError: error,
      message,
      codeFrame,
      firstFrame: codeLines?.length ? dim(codeLines[0]) : undefined,
    }
  }

  return {
    originError: error,
    message,
  }
}
import { parseStackLine, formatStack } from '@xbell/code-stack';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SourceMapConsumer } from 'source-map-js';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import debug from 'debug';
import { pathManager } from '../common/path-manager';
import { browserBuilder } from '../core/browser-builder';
import type { XBellError } from '../types';
import color from '@xbell/color';

const STACK_LINE_REG = /\((.+?):(\d+):(\d+)\)$/;

const debugError = debug('xbell:error');

function parseStackLines(stack: string) {
  const lines = stack.split('\n')

  let firstCodeLineIndex = lines.findIndex(line => line.startsWith('    at '));
  if (firstCodeLineIndex === -1) {
    firstCodeLineIndex = lines.length - 1;
  }
  const codeLines = lines.slice(firstCodeLineIndex);
  const formatLines = codeLines.map((line) => {
    const result = parseStackLine(line);

    if (result) {
      const isHTTPBundle = result.filename.includes(XBELL_BUNDLE_PREFIX);
      if (isHTTPBundle) {
        const [, bundlePath] = result.filename.split('?')[0].split(XBELL_BUNDLE_PREFIX + '/');
        const isProject = !bundlePath.includes('@fs');
        const filepath = isProject
          ? path.join(pathManager.projectDir, bundlePath)
          : path.join(pathManager.projectDir, 'node_modules', bundlePath);
        const fileURL = pathToFileURL(filepath).href;
        debugError('bundlePath', fileURL);

        return {
          content: line.replace(result.filename, fileURL),
          parsed: {
            ...result,
            filename: fileURL,
          },
          isBundleUrl: true,
          isInProjectPath: true,
        };
      }

      return {
        content: line,
        isBundleUrl: false,
        isInProjectPath: result.filename.includes(pathManager.projectDir),
      };
    }

    return {
      content: line,
      isBundleUrl: false,
      isInProjectPath: false,
    };
  });

  return {
    lines: formatLines,
    head: lines.slice(0, firstCodeLineIndex).join('\n'),
  }
}

export async function formatError(error: Error): Promise<XBellError> {
  if (!error.stack) {
    return error;
  }
  // const stacks = parseStack(error.stack!);
  // if (formatResult) {
  //   console.log(formatResult.codeLines);
  // }
  const stackResult = parseStackLines(error.stack!);
  // stackResult.lines.map(stack => stack.line)
  debugError('error:before', (error.stack!));
  debugError('error:after', stackResult);
  const server = await browserBuilder.server
  const [firstLine] = stackResult.lines || [];
  const module = await (async () => {
    if (firstLine?.isBundleUrl && firstLine.isInProjectPath) {
      // const relativePath = firstLine.lineResult!.filename.split(XBELL_BUNDLE_PREFIX)[1];
      // const id = path.join(pathManager.projectDir, relativePath);
      debugError('error:id', firstLine.parsed!.filename);
      return (await Promise.all([
        server.getModuleByUrl(
          fileURLToPath(firstLine.parsed!.filename)
        ),
      ]))[0];
    }
    return undefined;
  })();
  
  if (module?.map) {
    debugError('error:lineReslt', firstLine.parsed!);
    const sourceMap = new SourceMapConsumer(module.map)

    const position = sourceMap.originalPositionFor({
      column: firstLine.parsed!.columns,
      line: firstLine.parsed!.lines,
    });

    if (position) {
      const stackMessage = formatStack(
        fileURLToPath(firstLine.parsed!.filename), {
        lines: position.line,
        columns: position.column + 1,
      });
      const formatMessage = [
        color.red(stackResult.head),
        '',
        stackMessage,
        '',
        color.white.dim(firstLine.content.replace(STACK_LINE_REG, (_, file) => {
          return `${file}:${position.line}:${position.column}`;
        })),
      ].join('\n');
      debugError('error:position', position, formatMessage);
      return {
        ...error,
        formatMessage,
      }
    }
  }

  return error;
}

export function getCallSite(): NodeJS.CallSite[] {
  const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const callSite = (new Error('').stack as unknown as NodeJS.CallSite[]).slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
  return callSite;
}

// import * as fs from 'fs';
// import { codeFrameColumns } from '@babel/code-frame';
// import StackUtils  from 'stack-utils';
// import color from '@xbell/color';
// import type { XBellError } from '../types/record';

// const stackUtils = new StackUtils({
//   cwd: 'empty',
// })


// function parseStack(stack: string) {
//   const lines = stack.split('\n')
//   let firstCodeLine = lines.findIndex(line => line.startsWith('    at '));
//   if (firstCodeLine === -1) {
//     firstCodeLine = lines.length - 1;
//   }
//   const message = lines.slice(0, firstCodeLine).join('\n');
//   const codeLines = lines.slice(firstCodeLine);
//   for (const line of codeLines) {
//     const parsed = stackUtils.parseLine(line);
//     if (!parsed || !parsed.file || parsed.file.includes('node_module') || parsed.file.includes('node:')) continue;
//     // const resolvedFile = path.join(process.cwd(), parsed.file);
//     // console.log(' parsed.file',  parsed.file);
//     const location = {
//       filename: parsed.file,
//       column: parsed.column || 0,
//       line: parsed.line || 0,

//     }
//     return {
//       location,
//       codeLines,
//       message,
//     }
//   }
// }

// export function parseError(error: Error): XBellError | void {
//   if (!error.stack) {
//     return;
//   }

//   const stackRet = parseStack(error.stack);
//   if (!stackRet) {
//     return;
//   }
//   const { location, codeLines, message } = stackRet;

//   if (location) {
//     const codeFrame = codeFrameColumns(
//       fs.readFileSync(location.filename, 'utf8'),
//       {
//         start: location
//       },
//       {
//         highlightCode: true,
//       }
//     )
//     console.log()
//     console.log('');
//     console.log(codeFrame);
//     return {
//       originError: error,
//       message,
//       codeFrame,
//       firstFrame: codeLines?.length ? color.dim(codeLines[0]) : undefined,
//     }
//   }

//   return {
//     originError: error,
//     message,
//   }
// }
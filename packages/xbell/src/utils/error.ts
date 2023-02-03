import type { XBellError } from '../types';
import color from '@xbell/color';
import { parseStackLine, formatStack } from '@xbell/code-stack';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { fileURLToPath, getProjectRelativePath } from './path';
import { pathToFileURL } from 'node:url';
import { RawSourceMap, SourceMapConsumer } from 'source-map-js';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import debug from 'debug';
import { pathManager } from '../common/path-manager';
// import { browserBuilder } from '../core/browser-builder';
import { compiler } from '../compiler/compiler';
import { transfomer } from '../core/transfomer';

const STACK_LINE_REG = /\((.+?):(\d+):(\d+)\)$/;

const debugError = debug('xbell:error');

function isEvaluateCalback(line: string) {
  return line.includes('eval at evaluate');
}

function parseStackLines(stack: string) {
  const lines = stack.split('\n')

  let firstCodeLineIndex = lines.findIndex(line => line.startsWith('    at '));
  if (firstCodeLineIndex === -1) {
    firstCodeLineIndex = lines.length - 1;
  }
  const codeLines = lines.slice(firstCodeLineIndex);
  const formatLines = codeLines.map((line) => {
    const parsed = parseStackLine(line);

    if (parsed) {
      const isHTTPBundle = parsed.filename.includes(XBELL_BUNDLE_PREFIX);
      if (isHTTPBundle) {
        const [, bundlePath] = parsed.filename.split('?')[0].split(XBELL_BUNDLE_PREFIX + '/');
        const isProject = !bundlePath.includes('@fs') && !bundlePath.includes('node_modules') && !bundlePath.includes('.vite/deps');
        const filepath = isProject
          ? path.join(pathManager.projectDir, bundlePath)
          : path.join(pathManager.projectDir, 'node_modules', bundlePath);
        const fileURL = pathToFileURL(filepath).href;
        debugError('bundlePath', fileURL);

        return {
          content: line.replace(parsed.filename, fileURL),
          parsed: {
            ...parsed,
            filename: fileURL,
          },
          isBundleUrl: true,
          isInProjectPath: isProject,
        };
      }

      return {
        content: line,
        parsed,
        isBundleUrl: false,
        isInProjectPath: parsed.filename.includes(pathManager.projectDir),
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

function getNodeJSFileMap(filename: string): {
  code: string;
  map: RawSourceMap;
} | null {
  const compileRet = compiler.compileNodeJSCode(
    fs.readFileSync(filename, 'utf-8'),
    filename
  );
  if (compileRet) {
    
    const { code, map } = compileRet;
    // const buff = Buffer.from(mapBase64!, 'base64');
    // const map = buff.toString('utf-8');
    debugError('map', typeof map, map);
    try {
      return {
        code,
        map: JSON.parse(map!) as RawSourceMap,
      };
    } catch {}
  }

  return null;
}

function getOriginPosition(map: RawSourceMap, position: { column: number, line: number }) {
  const sourceMap = new SourceMapConsumer(map)

  const originPosition = sourceMap.originalPositionFor(position);

  return {
    ...originPosition,
    column: originPosition.column + 1,
  };
}


async function formatBrowserError(error: Error, options: Partial<{
  browserTestFunction: {
    body: string;
    filename: string;
  }
}>  = {}): Promise<XBellError> {
  if (!error.stack) {
    return error;
  }
  const { browserTestFunction } = options;
  const stackResult = parseStackLines(error.stack!);
  // debugError('error:before', (error.stack!));
  // debugError('error:after', stackResult);
  const inProjectLines = stackResult.lines.filter(item => item.isInProjectPath || isEvaluateCalback(item.content));
  const [firstLine] = (inProjectLines.length ? inProjectLines : stackResult.lines) || [];
  // debugError('error:firstLine', firstLine);
  const isEvaluateFunction = !!firstLine.parsed && isEvaluateCalback(firstLine.content) && !!browserTestFunction;
  if (browserTestFunction && stackResult.head) {
    stackResult.head = stackResult.head.replace(/^jsHandle\.evaluate\:\ /, '');
  }
  if (isEvaluateFunction && firstLine.parsed) {
    const originEvaluatePosition = firstLine.parsed;
    const { map: fileMap, code: fileCompiledCode } = getNodeJSFileMap(browserTestFunction.filename) ?? {};
    const indexInCompiledCode = fileCompiledCode!.indexOf(browserTestFunction.body);

    if (fileMap && indexInCompiledCode !== -1) {

      const linesForCompiledCode = fileCompiledCode!.split('\n');
      const originPosition = (() => {
        let currIdx = 0;
        for (const [currLine, line] of linesForCompiledCode.entries()) {
          currIdx += line.length;
          if (currIdx >= indexInCompiledCode) {
            const filePosition = {
              line: currLine + originEvaluatePosition.line,
              column: originEvaluatePosition.column,
            }
            const originFilePosition = getOriginPosition(fileMap, filePosition);
            // debugError('browser-origin-file-position', originFilePosition, filePosition, fileCompiledCode);

            return originFilePosition;
          }
        }

        return null;
      })();

      if (originPosition) {
        const stackMessage = formatStack(
          browserTestFunction.filename, {
          line: originPosition.line,
          column: originPosition.column,
        });
        const formatMessage = [
          color.white(stackResult.head),
          '',
          stackMessage,
          '',
          color.white.dim(firstLine.content.replace(STACK_LINE_REG, () => {
            return `${getProjectRelativePath(browserTestFunction.filename)}:${originPosition.line}:${originPosition.column}`;
          })),
        ].join('\n');
        return {
          ...error,
          formatMessage,
        }
      }
    }

    return error;
  }

  const module = await (async () => {
    if (firstLine?.isBundleUrl && firstLine.isInProjectPath) {
      // const relativePath = firstLine.lineResult!.filename.split(XBELL_BUNDLE_PREFIX)[1];
      // const id = path.join(pathManager.projectDir, relativePath);
      return transfomer.cache.get(fileURLToPath(firstLine.parsed!.filename));
    }
    return undefined;
  })();
  
  if (module?.map) {
    // TODO: handle string source map
    const originPosition = getOriginPosition(module.map as RawSourceMap, firstLine.parsed!);
    if (originPosition) {
      const stackMessage = formatStack(
        fileURLToPath(firstLine.parsed!.filename), {
        line: originPosition.line,
        column: originPosition.column,
      });
      const formatMessage = [
        color.white(stackResult.head),
        '',
        stackMessage,
        '',
        color.white.dim(firstLine.content.replace(STACK_LINE_REG, (_, file) => {
          return `${
            getProjectRelativePath(fileURLToPath(file))
          }:${originPosition.line}:${originPosition.column}`;
        })),
      ].join('\n');
      return {
        ...error,
        formatMessage,
      }
    }
  }

  return error;
}


function formatNodeJSError(error: Error): XBellError {
  if (!error.stack) return error;
  const stackResult = parseStackLines(error.stack!);
  const inProjectLines = stackResult.lines.filter(item => item.isInProjectPath || isEvaluateCalback(item.content));
  const [firstLine] = (inProjectLines.length ? inProjectLines : stackResult.lines) || [];
  const parsed = firstLine?.parsed;
  if (!parsed) {
    return error;
  }

  // debugError('parsed', parsed);
  // const ret = getNodeJSFileMap(
  //   fileURLToPath(parsed.filename)
  // );

  // debugError('ret', ret);

  // if (!ret) return error;

  // const originPosition = getOriginPosition(ret.map, {
  //   column: parsed.column,
  //   line: parsed.line,
  // });

  // debugError('originPosition', originPosition);

  const stackMessage = formatStack(
    parsed.filename, {
    line: parsed.line,
    column: parsed.column,
  });
  const formatMessage = [
    color.white(stackResult.head),
    '',
    stackMessage,
    '',
    color.white.dim(firstLine.content.replace(STACK_LINE_REG, () => {
      return `${getProjectRelativePath(parsed.filename)}:${parsed.line}:${parsed.column}`;
    })),
  ].join('\n');
  return {
    ...error,
    formatMessage,
  };
}

export async function formatError(error: Error, options: Partial<{
  browserTestFunction: {
    body: string;
    filename: string;
  }
}>): Promise<XBellError> {
  if (options.browserTestFunction) {
    return formatBrowserError(error, options);
  }

  return formatNodeJSError(error);
}


export function getCallSite(): NodeJS.CallSite[] {
  const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const callSite = (new Error('').stack as unknown as NodeJS.CallSite[]).slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
  return callSite;
}

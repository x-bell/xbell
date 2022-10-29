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
import { browserBuilder } from '../core/browser-builder';
import { compiler } from '../compiler/compiler';

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
    const parsed = parseStackLine(line);

    if (parsed) {
      const isHTTPBundle = parsed.filename.includes(XBELL_BUNDLE_PREFIX);
      if (isHTTPBundle) {
        const [, bundlePath] = parsed.filename.split('?')[0].split(XBELL_BUNDLE_PREFIX + '/');
        const isProject = !bundlePath.includes('@fs');
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
          isInProjectPath: true,
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

async function getNodeJSFileMap(filename: string): Promise<{
  code: string;
  map: RawSourceMap;
} | null> {

  const compileRet = await compiler.compileNodeJSCode(
    fs.readFileSync(filename, 'utf-8'),
    filename
  );
  if (compileRet) {

    const [code, mapBase64] = compileRet.code.split('//# sourceMappingURL=data:application/json;base64,');
    const buff = Buffer.from(mapBase64, 'base64');
    const map = buff.toString('utf-8');

    try {
      return {
        code,
        map: JSON.parse(map) as RawSourceMap,
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


export async function formatError(error: Error, options: Partial<{
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
  debugError('error:before', (error.stack!));
  debugError('error:after', stackResult);
  const server = await browserBuilder.server
  const [firstLine] = stackResult.lines || [];
  const isEvaluateFunction = !!firstLine.parsed && firstLine.content.includes('eval at evaluate') && !!browserTestFunction;
  if (browserTestFunction && stackResult.head) {
    stackResult.head = stackResult.head.replace(/^jsHandle\.evaluate\:\ /, '');
  }
  debugError('error', error.name, 'msg:', error.message);
  if (isEvaluateFunction && firstLine.parsed) {
    const originEvaluatePosition = firstLine.parsed;
    const { map: fileMap, code: fileCompiledCode } = await getNodeJSFileMap(browserTestFunction.filename) ?? {};
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
            const originFilePosition = getOriginPosition(fileMap, {
              line: 58,
              column: 15,
            })
            debugError('browser-origin-file-position', originFilePosition, filePosition, fileCompiledCode);

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
          color.red(stackResult.head),
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
      return server.getModuleByUrl(
        fileURLToPath(firstLine.parsed!.filename)
      );
    }
    return undefined;
  })();
  
  if (module?.map) {
    const originPosition = getOriginPosition(module.map, firstLine.parsed!);
    if (originPosition) {
      const stackMessage = formatStack(
        fileURLToPath(firstLine.parsed!.filename), {
        line: originPosition.line,
        column: originPosition.column,
      });
      const formatMessage = [
        color.red(stackResult.head),
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

export function getCallSite(): NodeJS.CallSite[] {
  const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const callSite = (new Error('').stack as unknown as NodeJS.CallSite[]).slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
  return callSite;
}

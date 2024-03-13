import type { TransformResult, Plugin } from 'vite';
import type { ExistingRawSourceMap } from 'rollup';
import { createInstrumenter } from 'istanbul-lib-instrument';
// @ts-expect-error missing types
import TestExclude from 'test-exclude';
import { CoverageOptions } from './types';
import { DEFAULT_EXCLUDE, DEFAULT_EXTENSION } from './config';

declare global {
  var __xbell_coverage__: any;
}

const PLUGIN_NAME = 'vite:xbell-istanbul';
const MODULE_PREFIX = '/@modules/';
const NULL_STRING = '\0';
const XBELL_COVERAGE_NAME = '__xbell_coverage__';

function sanitizeSourceMap(rawSourceMap: ExistingRawSourceMap): ExistingRawSourceMap {
  const { sourcesContent, ...sourceMap } = rawSourceMap;
  return JSON.parse(JSON.stringify(sourceMap));
}

function createTestExclude(opts: CoverageOptions): TestExclude {
  const { include, exclude = [], extension } = opts;
  const cwd = opts.cwd ?? process.cwd();

  // Only instrument when we want to, as we only want instrumentation in test
  // By default the plugin is always on
  const finalExclude = [...DEFAULT_EXCLUDE, ...(typeof exclude === 'string' ? [exclude] : exclude)];
  return new TestExclude({
    cwd,
    include: include,
    exclude: finalExclude,
    extension: extension ?? DEFAULT_EXTENSION,
    excludeNodeModules: true,
  });
}

export function viteCoveragePlugin(opts: CoverageOptions = {}): Plugin {
  const testExclude = createTestExclude(opts);
  const instrumenter = createInstrumenter({
    coverageVariable: XBELL_COVERAGE_NAME,
    preserveComments: true,
    produceSourceMap: true,
    autoWrap: true,
    esModules: true,
  });

  const enabled = opts.enabled ?? true;

  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    // instrument js
    enforce: 'post',
    transform(srcCode, id, options) {
      if (!enabled || options?.ssr || id.startsWith(MODULE_PREFIX) || id.startsWith(NULL_STRING)) {
        return;
      }

      if (testExclude.shouldInstrument(id)) {
        // @ts-ignore
        const sourceMap = sanitizeSourceMap(this.getCombinedSourcemap());
        // @ts-ignore
        const code = instrumenter.instrumentSync(srcCode, id, sourceMap);
        const map = instrumenter.lastSourceMap();

        return { code, map } as unknown as TransformResult;
      }
    },
  };
}

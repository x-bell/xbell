import type { ReportOptions } from 'istanbul-reports';
import type { CoverageMap } from 'istanbul-lib-coverage'
import * as path from 'node:path';
import libCoverage from 'istanbul-lib-coverage'
import libSourceMaps from 'istanbul-lib-source-maps'
import libReport from 'istanbul-lib-report'
import reports from 'istanbul-reports';
// @ts-expect-error missing types
import TestExclude from 'test-exclude';
import { CoverageOptions } from './types';
import { DEFAULT_EXCLUDE, DEFAULT_EXTENSION } from './config';

export class CoverageManager {
  private coverages: any[] = [];
  private testExclude: any;

  constructor(
    private opts: CoverageOptions
  ) {
    const { exclude = [], include, cwd, extension } = opts;
    this.testExclude = new TestExclude({
      cwd: cwd ?? process.cwd(),
      include,
      exclude: [...DEFAULT_EXCLUDE, ...(typeof exclude === 'string' ? [exclude] : exclude)],
      extension: extension ?? DEFAULT_EXTENSION,
      excludeNodeModules: true,
    });
  }

  addCoverage(coverage: any) {
    this.coverages.push(coverage);
  }

  async generateReport() {
    if (!this.coverages.length) {
      return;
    }

    const mergedCoverage: CoverageMap = this.coverages.reduce((coverage, previousCoverageMap) => {
      const map = libCoverage.createCoverageMap(coverage)
      map.merge(previousCoverageMap)
      return map
    }, {});

    const sourceMapStore = libSourceMaps.createSourceMapStore();
    const coverageMap: CoverageMap = await sourceMapStore.transformCoverage(mergedCoverage);
    const cwd = this.opts.cwd ?? process.cwd();
    const outputDir = this.opts.outputDir ?? path.join(cwd, 'coverage');
    const contextOptions = {
      dir: outputDir,
      coverageMap,
      sourceFinder: sourceMapStore.sourceFinder,
    };

    const context = libReport.createContext(contextOptions);

    const types: Array<keyof ReportOptions> = ['text', 'html', 'clover', 'json'];

    types.forEach((type) => {
      const options =  {
        skipFull: undefined,
        projectRoot: cwd,
      };
      reports.create(type, options).execute(context);
    })
  }
}

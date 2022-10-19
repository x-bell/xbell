import type { ReportOptions } from 'istanbul-reports';
import type { CoverageMap } from 'istanbul-lib-coverage'
import libCoverage from 'istanbul-lib-coverage'
import libSourceMaps from 'istanbul-lib-source-maps'
import libReport from 'istanbul-lib-report'
import reports from 'istanbul-reports';
import { pathManager } from './path-manager';


class CoverageManager {
  coverages: any[] = [];

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
    const coverageMap: CoverageMap = await sourceMapStore.transformCoverage(mergedCoverage)

    const contextOptions = {
      dir: pathManager.coverageDir,
      coverageMap,
      sourceFinder: sourceMapStore.sourceFinder,
    };

    const context = libReport.createContext(contextOptions);

    const types: Array<keyof ReportOptions> = ['text', 'html', 'clover', 'json'];

    types.forEach((type) => {
      const options =  {
        skipFull: undefined,
        projectRoot: process.cwd(),
      };
      reports.create(type, options).execute(context);
    })
  }
}

export const coverageManager = new CoverageManager();

import { CoverageManager as CM } from '@xbell/coverage';
import { pathManager } from './path-manager';
import { configurator } from './configurator';

class CoverageManager {
  protected _cw!: CM;
  setup() {
    const { coverage } = configurator.globalConfig;
    this._cw = new CM({
      cwd: pathManager.projectDir,
      outputDir: pathManager.coverageDir,
      exclude: coverage?.exclude,
      include: coverage?.include,
    });
  }

  addCoverage(coverage: any): void {
    this._cw.addCoverage(coverage);
  }

  generateReport(): Promise<void> {
    return this._cw.generateReport();
  }
}

export const coverageManager = new CoverageManager();

import { join } from 'node:path';
import * as url from 'node:url';

class PathManager {
  projectDir = process.cwd();
  xbellPkgDir = join(url.fileURLToPath(import.meta.url), '../../../');
  distDir = join(this.xbellPkgDir, './dist');
  tmpDir = join(this.projectDir, 'node_modules', '.xbell');
  testReportDir = join(this.projectDir, 'test-report');
  coverageDir = join(this.testReportDir, 'coverage');
  workerPath = join(this.distDir, './worker/worker.mjs');
}

export const pathManager = new PathManager();

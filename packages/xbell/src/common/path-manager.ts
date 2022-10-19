import { join } from 'node:path';
import * as url from 'node:url';

class PathManager {
  xbellPkgDir = join(url.fileURLToPath(import.meta.url), '../../../');
  distDir = join(this.xbellPkgDir, './dist');
  tmpDir = join(process.cwd(), 'node_modules', '.xbell');
  testReportDir = join(process.cwd(), 'test-report');
  coverageDir = join(this.testReportDir, 'coverage');
  workerPath = join(this.distDir, './worker/worker.mjs');
}

export const pathManager = new PathManager();

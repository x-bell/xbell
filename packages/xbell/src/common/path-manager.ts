import * as path from 'node:path';
import * as url from 'node:url';
import { commander } from '../common/commander';


const rootPath = (() => {
  const root = commander.getOptions().root;
  if (!root) {
    return process.cwd();
  }

  if (root.startsWith('/')) {
    return root;
  }

  return path.join(
    process.cwd(),
    root,
  );
})();

class PathManager {
  projectDir = rootPath;
  xbellPkgDir = path.join(url.fileURLToPath(import.meta.url), '../../../');
  distDir = path.join(this.xbellPkgDir, './dist');
  tmpDir = path.join(this.projectDir, 'node_modules', '.xbell');
  testReportDir = path.join(this.projectDir, 'test-report');
  coverageDir = path.join(this.testReportDir, 'coverage');
  workerPath = path.join(this.distDir, './worker/worker.mjs');
}

export const pathManager = new PathManager();

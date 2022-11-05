import * as path from 'node:path';
import * as url from 'node:url';
// import { program } from 'commander';
import type { CommandOptions } from '../types/cli';
import { program } from '../command';

const opts = program.opts<CommandOptions>();

const rootPath = (() => {
  if (!opts.root) {
    return process.cwd();
  }

  if (opts.root.startsWith('/')) {
    return opts.root;
  }

  return path.join(
    process.cwd(),
    opts.root,
  );
})();

console.log('rootPath', opts, rootPath);
process.exit(0);

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

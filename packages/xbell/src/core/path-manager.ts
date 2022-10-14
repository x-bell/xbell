import { join } from 'node:path';
import url from 'node:url';

class PathManager {
  xbellPkgDir = join(url.fileURLToPath(import.meta.url), '../../../');
  distDir = join(this.xbellPkgDir, './dist');
  workerPath = join(this.distDir, './worker/worker.mjs')
}

export const pathManager = new PathManager();

import type { XBellTestFileRecord } from '../types';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ensureDir, fouceRemove } from '../utils/fs';
import { pathManager } from './path-manager';

class HTMLReporter {
  async setup() {
    fouceRemove(pathManager.testReportDir);
    fouceRemove(pathManager.tmpDir);
    ensureDir(this.getAssetsPath());
  }

  generate(fileRecords: XBellTestFileRecord[]) {
  }

  getAssetsPath() {
    return path.join(pathManager.testReportDir, 'assets');
  }

  saveAsset(filepath: string) {
    const filename = path.basename(filepath);
    const newPath = path.join(this.getAssetsPath(), filename);
    fs.copyFileSync(
      filepath,
      newPath
    );

    return newPath;
  }
}

export const htmlReporter = new HTMLReporter();

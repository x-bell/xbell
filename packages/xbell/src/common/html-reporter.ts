import type { XBellTestCaseRecord, XBellTestFileRecord, XBellTestGroupRecord, XBellTestTaskRecord } from '../types';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ensureDir, fouceRemove } from '../utils/fs';
import { pathManager } from './path-manager';
import { generateHTML } from '@xbell/reporter';
class HTMLReporter {
  async setup() {
    fouceRemove(pathManager.testReportDir);
    fouceRemove(pathManager.tmpDir);
    ensureDir(this.getAssetsPath());
  }

  generateReport(fileRecords: XBellTestFileRecord[]) {
    // TODO: multi-projects
    // const data = JSON.stringify(, undefined, 2);
    // const dataPath = path.join(pathManager.testReportDir, 'data.json');
    // fs.writeFileSync(dataPath, data, 'utf-8');
    const htmlReport = generateHTML(this._fixData(fileRecords));

    fs.writeFileSync(
      path.join(pathManager.testReportDir, 'index.html'),
      htmlReport,
      'utf-8'
    );
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

  protected _fixData(fileRecords: XBellTestFileRecord[]): XBellTestFileRecord[] {
    return fileRecords.map(file => this._fixFile(file));
  }

  protected _fixFile(file: XBellTestFileRecord): XBellTestFileRecord {
    return {
      ...file,
      filename: this._getFixedFilename(file.filename),
      tasks: file.tasks.map(task => this._fixTask(task)),
    }
  }

  protected _fixTask(task: XBellTestTaskRecord): XBellTestTaskRecord {
    if (task.type === 'group') return this._fixGroup(task);

    return this._fixCase(task);
  }

  protected _fixGroup(group: XBellTestGroupRecord): XBellTestGroupRecord {
    return {
      ...group,
      filename: group.filename = this._getFixedFilename(group.filename),
      cases: group.cases.map(task => this._fixTask(task)),
    };
  }

  protected _fixCase(c: XBellTestCaseRecord): XBellTestCaseRecord {
    return {
      ...c,
      filename: this._getFixedFilename(c.filename),
      videos: c.videos?.length ? c.videos.map(videoPath => this._getFixedVideoPath(videoPath)): undefined,
      coverage: undefined,
    };
  }

  protected _getFixedFilename(filename: string) {
    return filename.replace(pathManager.projectDir + '/', '');
  }

  protected _getFixedVideoPath(videoPath: string): string {
    return videoPath.replace(
      path.join(pathManager.projectDir, 'test-report') + '/',
      ''
    );
  }
}

export const htmlReporter = new HTMLReporter();

import type { XBellTestCase, NodeJSTestArguments, XBellTestFile } from '../types/test';
import type { XBellProject } from '../types/config';
import { genLazyPage } from './lazy-page';
import { expect } from './expect/expect';
import { configurator } from '../common/configurator';
import { htmlReporter } from '../common/html-reporter';
import { fn, spyOn } from './utils';

export class ArgumentManager {
  page = genLazyPage({
    browserCallbacks: this._case.runtimeOptions.browserCallbacks || [],
    browserMocks: this._case.browserMocks,
    // TODO: _testFunctionFilename in node
    filename: this._case._testFunctionFilename ?? this._case.filename,
    file: this._file,
  });

  project: XBellProject;

  constructor(
    protected _file: XBellTestFile,
    protected _case: XBellTestCase<any, any>
  ) {
    const { globalConfig } = configurator;
    const project = globalConfig.projects!.find(project => project.name === _file.projectName);
    if (!project) {
      throw new Error('Not found project');
    }
    this.project = project;
  }

  getArguments(): NodeJSTestArguments & Partial<{ item: any, index: number }>{
    return {
      page: this.page,
      project: this.project,
      expect,
      spyOn,
      fn,
      ...(this._case.options.each ? this._case.options.each : {}),
      sleep: (duration: number) => new Promise<void>(r => setTimeout(r, duration)),
      runtime: 'nodejs',
    };
  }

  async terdown() {
    if (this.page.used) {
      const video = await this.page.video()
      if (video) {
        const filepath = await video.path();
        await this.page.close();
        return {
          videoPath: htmlReporter.saveAsset(filepath),
        }
      } else {
        await this.page.close();
      }
    }
  }

  async genCoverage() {
    if (this.page.used && configurator.globalConfig.coverage?.enabled) {
      const coverage = await this.page.evaluate(() => {
        return window.__xbell_coverage__;
      });
      return coverage;
    }
  }
}

import type { XBellTestCase, XBellTestCaseFunctionArguments } from '../types/test';
import type { XBellProject } from '../types/config';
import { genLazyPage } from './lazy-page';
import { workerContext } from './worker-context';
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
  });

  project: XBellProject;

  constructor(protected _case: XBellTestCase<any, any>) {
    const { projectName } = workerContext.workerData;
    const { globalConfig } = configurator;
    const project = globalConfig.projects!.find(project => project.name === projectName);
    if (!project) {
      throw new Error('Not found project');
    }
    this.project = project;
  }

  getArguments(): XBellTestCaseFunctionArguments {
    return {
      page: this.page,
      project: this.project,
      expect,
      spyOn,
      fn
    }
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

import type { XBellTestCaseFunctionArguments } from '../types/test';
import type { XBellProject } from '../types/project';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { genLazyPage } from './lazy-page';
import { workerContext } from './worker-context';

export class ArgumentManager {
  page = genLazyPage();
  project: XBellProject;

  constructor() {
    const { globalConfig, projectName } = workerContext.workerData;
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
    }
  }

  async terdown() {
    await this.page.close();
  }

  async genCoverage() {
    if (this.page.used) {
      const coverage = await this.page.evaluate(() => {
        return window.__coverage__;
      });
      // @ts-ignore
      if (coverage) {
        // TODO: coverage
        fs.writeFileSync(
          path.join(process.cwd(),
          '__coverage__.json'),
          JSON.stringify(coverage),
          'utf-8'
        );
      }
    }
  }
}

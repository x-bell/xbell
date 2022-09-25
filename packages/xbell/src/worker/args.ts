import type { XBellTestCaseFunctionArguments } from '../types/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { genLazyPage } from './lazy-page';

export class ArgumentManager {
  page = genLazyPage();

  constructor() {
  }

  getArguments(): XBellTestCaseFunctionArguments {
    return {
      page: this.page,
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
        fs.writeFileSync(path.join(process.cwd(), '__coverage__.json'), JSON.stringify(coverage), 'utf-8');
      }
    }
  }
}

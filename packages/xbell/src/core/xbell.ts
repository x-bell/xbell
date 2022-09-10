
import { configurator } from '../common/configurator';
import { Scheduler, XBellScheduler } from './scheduler';
import { logger, Logger, XBellLogger } from '../common/logger';
import glob from 'fast-glob';
import { scheduler } from './scheduler';
import { join } from 'node:path';
import process from 'node:process';
import { recorder } from './recorder';
import { printer } from './printer';
import { prompter } from '../prompter';

class XBell {
  setup() {
    recorder.subscribe((records) => {
      printer.print(records);
    });
  }

  async runTest() {
    this.setup();
    recorder.setStartTime(Date.now());
    const globalConfig = await configurator.globalConfig;
    const testDir = globalConfig.testDir || process.cwd();
    const testFilepaths = glob.sync('**/*.{spec,test}.{cjs,mjs,js,jsx,ts,tsx}', {
      cwd: testDir,
      ignore: ['node_modules', 'dist', 'build', '.git', '.cache', '.idea'],
    }).map(relativeFilepath => join(testDir, relativeFilepath));
    if (!testFilepaths.length) {
      prompter.displayError('NotFoundTestFiles');
    }
    await scheduler.init();
    await scheduler.run(testFilepaths);
  }
}

export const xbell = new XBell()


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
  async setup() {
    await configurator.setup();
    await scheduler.setup();

    recorder.subscribe((records) => {
      printer.print(records);
    });
  }

  async runTest() {
    recorder.setStartTime(Date.now());
    const testFiles = await this.findTestFiles()

    if (!testFiles.length) {
      prompter.displayError('NotFoundTestFiles');
    } else {
      await scheduler.run(testFiles);
    }

  }

  async findTestFiles() {
    const { globalConfig } = configurator;
    const testDir = globalConfig.testDir || process.cwd();
    const testFiles = glob.sync(
      '**/*.{spec,test}.{cjs,mjs,js,jsx,ts,tsx}', {
        cwd: testDir,
        ignore: ['node_modules', 'dist', 'build', '.git', '.cache', '.idea'],
      }
    ).map(relativeFilepath => join(testDir, relativeFilepath));

    return testFiles;
  }
}

export const xbell = new XBell()


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
import { workerPool } from './worker-pool';
import { htmlReporter } from '../common/html-reporter';
import { pathManager } from '../common/path-manager';

class XBell {
  async setup() {
    await configurator.setup();
    await workerPool.setup();
    await scheduler.setup();
    await htmlReporter.setup();

    recorder.subscribe((records) => {
      printer.print(records);
    });
  }

  async runTest() {
    recorder.setStartTime(Date.now());
    const testFiles = await this.findTestFiles()
    if (!testFiles.length) {
      prompter.displayError('NotFoundTestFiles', { exit: true });
    } else {
      await scheduler.run(testFiles);
    }

  }

  async findTestFiles() {
    const { globalConfig } = configurator;
    const testDir = pathManager.projectDir;
    const testFiles = glob.sync(
      globalConfig.include,
      {
        cwd: testDir,
        ignore: globalConfig.exclude,
      }
    ).map(relativeFilepath => join(testDir, relativeFilepath));

    return testFiles;
  }
}

export const xbell = new XBell()

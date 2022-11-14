
import type { XBellProject } from '../types';
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
import debug from 'debug';

const debugContext = debug('xbell:context');
class XBell {
  async setup() {
    await configurator.setup();
    await scheduler.setup();
    await htmlReporter.setup();

    recorder.subscribe((records) => {
      printer.print(records);
    });

    await configurator.runConfigSetup();
  }

  async runTest(filters?: string[]) {
    recorder.setStartTime(Date.now());
    const { projects } =  configurator.globalConfig;
    debugContext('projects', projects);
    const multiProjects = await Promise.all(
      projects.map(async (project) => {
        return {
          project,
          testFiles: await this.findTestFiles({ project, filters })
        }
      }),
    );
    await scheduler.run(multiProjects);
    printer.onAllDone(recorder.tree);
    await recorder.onAllDone();
  }

  async findTestFiles({
    project,
    filters,
  }: {
    project: XBellProject;
    filters?: string[];
  }) {
    const { globalConfig } = configurator;
    const testDir = pathManager.projectDir;
    const include = project.config?.include ?? globalConfig.include;
    const exclude = project.config?.exclude ?? globalConfig.exclude;

    let testFiles = (await glob(
      include,
      {
        cwd: testDir,
        ignore: exclude,
      }
    )).map(relativeFilepath => ({
      absoluteFileath: join(testDir, relativeFilepath),
      relativeFilepath
    }));

    if (filters?.length) {
      testFiles = testFiles.filter(({ relativeFilepath }) => filters.some(filter => relativeFilepath.includes(filter)));
    }

    return testFiles.map(item => item.absoluteFileath);
  }


  // async runProject({
  //   project,
  //   filters,
  // }: {
  //   project: XBellProject;
  //   filters?: string[];
  // }) {

  //   const testFiles = await this.findTestFiles({ project, filters });
  //   if (!testFiles.length) {
  //     prompter.displayError('NotFoundTestFiles', { exit: true });
  //   } else {
  //     await scheduler.run({
  //       project,
  //       testFiles,
  //     });
  //   }
  // }
}

export const xbell = new XBell()

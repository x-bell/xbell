
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
import { htmlReporter } from '../common/html-reporter';
import { pathManager } from '../common/path-manager';
import { coverageManager } from '../common/coverage-manager';
import debug from 'debug';
import color from '@xbell/color';
import { commander } from '../common/commander';
import { crossEnv } from '../common/cross-env';

const debugContext = debug('xbell:context');
class XBell {
  async setup() {
    await configurator.setup();
    const { jsx } = configurator.globalConfig.compiler;
    if (jsx?.pragma) crossEnv.set('jsxPragmaFrag', jsx.pragma);
    if (jsx?.pragmaFrag) crossEnv.set('jsxPragmaFrag', jsx.pragmaFrag);
    coverageManager.setup();
    await scheduler.setup();
    await htmlReporter.setup();

    recorder.subscribe((records) => {
      printer.print(records);
    });

    if (typeof configurator.globalConfig.setup === 'function') {
      console.log(
        color.cyan('Running setup...')
      );
      await configurator.runConfigSetup(configurator.globalConfig.setup);
    }

  }

  async runTest(filters?: string[]) {
    recorder.setStartTime(Date.now());
    const projects = this.getFilterProjects();
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

  protected getFilterProjects() {
    const { projects } =  configurator.globalConfig;
    const projectNames = commander.getOptions().projects;
    if (!projectNames) {
      return projects;
    }
    const filterProjects = projects.filter(project => projectNames.some(name => project.name === name));
    if (!filterProjects.length) {
      throw new Error(`Not found projects: [${projectNames.join(', ')}]`);
    }

    return filterProjects;
  }
}

export const xbell = new XBell()

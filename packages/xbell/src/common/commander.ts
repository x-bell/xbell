import process from 'node:process';
import type { CommandOptions } from '../types/cli';
import { ProcessEnvKeys } from '../constants/env';

class Commander {
  setup(cliOpts: CommandOptions) {
    const { coverage, root, projects } = cliOpts;
    process.env[ProcessEnvKeys.CLICoverage] = cliOpts.coverage ? String(cliOpts.coverage) : '';
    process.env[ProcessEnvKeys.CLIRoot] = cliOpts.root ? cliOpts.root : '';
    process.env[ProcessEnvKeys.CLI_PROJECTS] = cliOpts.projects?.length ? JSON.stringify(cliOpts.projects) : '';
  }

  getOptions(): CommandOptions {
    const projectListStr = process.env[ProcessEnvKeys.CLI_PROJECTS];
    return {
      coverage: !!process.env[ProcessEnvKeys.CLICoverage],
      root: process.env[ProcessEnvKeys.CLIRoot],
      projects: projectListStr ? JSON.parse(projectListStr) as string[] : undefined,
    };
  }
}

export const commander = new Commander();

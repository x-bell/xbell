import 'reflect-metadata';
import * as fs from 'fs';
import { resolve, join } from 'path';
import { chromium } from 'playwright-core';
import { container, Context } from './core';
import { MetaDataType } from './constants';
import { sleep, prettyPrint } from './utils';
import { Command } from 'commander';

const program = new Command();

interface CommandOptions {
  file: string;
  group: string;
  case: string;
}

program
  .option('-f, --file <type>', '指定测试文件')
  .option('-g, --group <type>', '指定测试group')
  .option('-c, --case <type>', '指定测试case');

program.parse(process.argv);

const commandOptions = program.opts() as CommandOptions;

export async function load(rootDir: string) {
  // 启动 IoC
  container.initConfig(rootDir, {
    groupName: commandOptions.group,
    caseName: commandOptions.case,
  });
  // load cases
  const caseDir = join(rootDir, 'src/cases');
  const caseFiles = fs.readdirSync(caseDir);
  // TODO: 支持参数指定文件名 + case 名
  for (const caseFile of caseFiles) {
    const isTS = /\.ts$/.test(caseFile);
    const isExec = commandOptions.file ? isTS && caseFile.includes(commandOptions.file): isTS;
    if (isExec) {
      const exports = require(resolve(caseDir, caseFile));
      container.addExports(exports);
    }
  }

  // 运行所有环境
  await container.runAllEnvs();
}

(async () => {
  const rootDir = join(process.cwd(), '');
  await load(rootDir);
})();

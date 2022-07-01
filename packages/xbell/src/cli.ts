import 'reflect-metadata';
import * as fs from 'fs';
import { resolve, join } from 'path';
import { container, Context } from './core';
import { MetaDataType } from './constants';
import { sleep, prettyPrint } from './utils';
import { Command } from 'commander';
import { checkDownloadSpeed } from './utils/network';

const pwServer = require('playwright-core/lib/server');
const program = new Command();



interface CommandOptions {
  file?: string;
  group?: string;
  case?: string;
  debug?: boolean;
  env?: string;
}

const BROWSER_SOURCES = [
  'https://cnpmjs.org/mirrors/playwright',
  'https://playwright.azureedge.net',
];

const TEST_BROWSER_ZIP = '/builds/chromium/1000/chromium-linux.zip'

async function tryToDownlaod1M(sourceUrl: string) {
  const maxDownloadByteSize = 1024 * 1024;
  await checkDownloadSpeed(sourceUrl + TEST_BROWSER_ZIP, {
    maxDownloadByteSize,
    timeout: 1000 * 10,
  });
  return sourceUrl;
}

program
  .command('run', { isDefault: true })
  .option('-f, --file <type>', '指定测试文件')
  .option('-g, --group <type>', '指定测试 group')
  .option('-c, --case <type>', '指定测试 case')
  .option('-e, --env <type>', '指定 env 环境')
  .option('-d, --debug', '调试模式: 不会清空打印等')
  .action(async (commandOptions: CommandOptions) => {
    const rootDir = process.cwd();
    // 启动 IoC
    container.initConfig(rootDir, {
      groupName: commandOptions.group,
      caseName: commandOptions.case,
      debug: commandOptions.debug,
      env: commandOptions.env,
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
  });

program
  .command('install [browser...]')
  .action(async (browsers: string[]) => {
    const sourceHost = await Promise.race(BROWSER_SOURCES.map((source) => tryToDownlaod1M(source)));
    process.env.PLAYWRIGHT_DOWNLOAD_HOST = sourceHost;
    // TODO: 暂仅支持全部安装
    // const installAll = !browsers.length || (browsers.length === 1 && browsers[0] === 'browser')
    const executables = pwServer.registry.defaultExecutables();
    await pwServer.registry.install(executables, false);
    process.exit(0);
  });

program.parse();

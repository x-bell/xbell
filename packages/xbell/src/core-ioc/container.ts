import { chromium } from 'playwright-core';
import fs from 'fs-extra';

import { XBellCaseRecord, XBellGroupRecord, generateHTML } from 'xbell-reporter';
import { MetaDataType, ParameterType } from '../constants/index';
import { getParameters, getMetadataKeys, prettyPrint } from '../utils/index';
import { Context } from './context';
import { XBellConfig, IBatchData, PropertyKey, MultiEnvData } from '../types/index';
// import { Reporter, Status, CaseRecord, GroupRecord } from './reporter';
import { CreateDecorateorCallback } from './custom';
import filenamify from 'filenamify';
import * as path from 'path';
import chalk from 'chalk';
import { startServer } from '../unit/server';
import { Recorder } from '../recorder';
import { Printer } from '../printer';
import { ViteDevServer } from 'vite';


const defaultXBellConfig: Partial<XBellConfig> = {
  viewport: {
    width: 1380,
    height: 720,
  },
  browsers: ['chromium'],
  headless: false,
};

interface ICase {
  caseName: PropertyKey,
  propertyKey: PropertyKey
}

interface IGroup {
  filename: string;
  groupName: PropertyKey;
  constructor: Function
}

interface IDepend {
  params: any[]
  constructor: Function
  propertyKey: PropertyKey
  targetConstructor: Function
  targetPropertyKey: PropertyKey;
}

// IoC Container
class Container {
  public startTime = Date.now();
  public groups: IGroup[] = [];
  public dpendMap = new Map<Function, Map<PropertyKey, IDepend[]>>();
  public caseMap = new Map<Function, ICase[]>();
  public batchDataMap = new Map<Function, Map<PropertyKey, IBatchData>>();
  public exportMap = new WeakMap<any, true>();
  public runEnvGroupMap = new Map<Function, XBellEnv['name'][]>();
  public runEvnCaseMap = new Map<Function, Map<PropertyKey, XBellEnv['name'][]>>();
  public targetGroupName?: string;
  public targetCaseName?: string;
  public debug!: boolean;
  public recorder!: Recorder;
  public printer!: Printer;
  public devServer!: Promise<ViteDevServer>;
  public _currentFilename!: string;
  // public envConfig: EnvConfig;
  // public reporterMap: Map<XBellEnv['name'], Reporter> = new Map();
  protected bellConfig!: XBellConfig;
  protected projectDirPath!: string;
  protected classDecoratorMap = new Map<Function, {
    callback: CreateDecorateorCallback;
    parameters: any[]
  }[]>()

  protected methodDecoratorMap = new Map<Function, Map<PropertyKey, {
    callback: CreateDecorateorCallback;
    parameters: any[]
  }[]>>()

  protected classConfigMap = new Map<Function, Partial<XBellConfig>>()

  protected methodConfigMap = new Map<Function, Map<PropertyKey, Partial<XBellConfig>>>()

  get htmlReportPath() {
    const formatZero = (num: number) => num < 10 ? `0${num}` : num;

    const date = new Date(this.startTime);
    const displayTime =
      date.getFullYear() + '-' +
      date.getMonth() + 1 + '-' +
      date.getDate() + '--' +
      formatZero(date.getHours()) + '-' +
      formatZero(date.getMinutes()) + '-' +
      formatZero(date.getSeconds());
    
      return `html-report-${displayTime}`;
  }

  public addGroup(groupName: string, constructor: Function) {
    this.groups.push({
      groupName,
      constructor,
      filename: this._currentFilename,
    });
  }

  public getGroups() {
    return this.groups;
  }

  public addDepend(constructor: Function, propertyKey: PropertyKey, targetConstructor: Function, targetPropertyKey: PropertyKey, params: any[]) {
    const propertyKeyMap = this.dpendMap.get(constructor) || new Map<PropertyKey, IDepend[]>();
    const depends = propertyKeyMap.get(propertyKey) || [];
    depends.push({
      params,
      propertyKey,
      constructor,
      targetConstructor,
      targetPropertyKey
    });
    propertyKeyMap.set(propertyKey, depends);
    this.dpendMap.set(constructor, propertyKeyMap);
  }

  public getDepends(constructor: Function, propertyKey: PropertyKey) {
    return this.dpendMap.get(constructor)?.get(propertyKey) || [];
  }

  public addCase(caseName: PropertyKey, target: Object, propertyKey: PropertyKey) {
    const cases = this.caseMap.get(target.constructor) || [];
    cases.push({
      propertyKey,
      caseName,
    });
    this.caseMap.set(target.constructor, cases);
  }

  public getCases(constructor: Function): ICase[] {
    return this.caseMap.get(constructor) || [];
  }

  public getValidCase(constructor: Function, envName: XBellEnv['name']): ICase[] {
    return this.targetCaseName
      ? this.getCases(constructor).filter(c => c.caseName === this.targetCaseName && this.getMethodConfig(constructor, c.propertyKey).envs.map(env => env.name).includes(envName))
      : this.getCases(constructor).filter(c => this.getMethodConfig(constructor, c.propertyKey).envs.map(item => item.name).includes(envName));
  }

  public setBatchData(constructor: Function, propertyKey: PropertyKey, data: IBatchData) {
    const propertyKeyMap = this.batchDataMap.get(constructor) || new Map<PropertyKey, IBatchData>();
    propertyKeyMap.set(propertyKey, data);
    this.batchDataMap.set(constructor, propertyKeyMap);
  }

  public getBatchData<T>(constructor: Function, propertyKey: PropertyKey, env: XBellEnv['name']): T[] {
    const batchData = this.batchDataMap.get(constructor)?.get(propertyKey);
    return (Array.isArray(batchData?.list) ? batchData?.list : batchData?.list?.[env!]) as T[];
  }

  public addCustomClassDecorator(cls: Function, callback: CreateDecorateorCallback, parameters: any[]) {
    const decorators = this.classDecoratorMap.get(cls) || [];
    decorators.push({
      callback,
      parameters
    });
    this.classDecoratorMap.set(cls, decorators);
  }

  public getCustomClassDecorator(cls: Function) {
    return this.classDecoratorMap.get(cls) || [];
  }

  public addCustomMethodDecorator(cls: Function, propertyKey: PropertyKey, callback: CreateDecorateorCallback, parameters: any[]) {
    if (!this.methodDecoratorMap.get(cls)) {
      this.methodDecoratorMap.set(cls, new Map());
    }

    const decorators = this.methodDecoratorMap.get(cls)?.get(propertyKey) || [];
    decorators.push({
      callback,
      parameters
    });

    this.methodDecoratorMap.get(cls)?.set(propertyKey, decorators)
  }

  public getCustomMethodDecorator(cls: Function, propertyKey: PropertyKey) {
    return this.methodDecoratorMap.get(cls)?.get(propertyKey) || [];
  }

  public addClassConfig(cls: Function, config: Partial<XBellConfig>) {
    const beforeConfig = this.classConfigMap.get(cls) || {};
    this.classConfigMap.set(cls, {
      ...beforeConfig,
      ...config,
    })
  }

  public addMethodConfig(cls: Function, propertyKey: PropertyKey, config: Partial<XBellConfig>) {
    if (!this.methodConfigMap.get(cls)) {
      this.methodConfigMap.set(cls, new Map());
    }
    const beforeConfig = this.methodConfigMap.get(cls)?.get(propertyKey) || {};
    const finalConfig = {
      ...beforeConfig,
      ...config,
    };
    this.methodConfigMap.get(cls)?.set(propertyKey, finalConfig)
  }

  public getClassConfig(cls: Function): XBellConfig {
    return {
      ...this.bellConfig,
      ...(this.classConfigMap.get(cls) || {})
    }
  }

  public getMethodConfig(cls: Function, propertyKey: PropertyKey): XBellConfig {
    const ret = {
      ...this.getClassConfig(cls),
      ...(this.methodConfigMap.get(cls)?.get?.(propertyKey) || {})
    };

    return ret;
  }

  public async runAllGroup(envConfig: XBellEnv) {
    const exportGroups = this.groups.filter(group => this.isValidGroup(group, envConfig.name));
    for (const [groupIndex, group] of Array.from(exportGroups.entries())) {
      const cases = this.getValidCase(group.constructor, envConfig.name);
      if (!cases.length) {
        console.log(chalk.red(`该组${String(group.groupName)}暂无case`));
        return;
      }
      try {
        // prettyPrint.groupRuning(group.groupName)
        await this.runGroup(group, groupIndex, envConfig);
      } catch(error) {
        throw error;
        console.log('error:', error);
        // 1. console 提示
        // 2. 错误代码栈展开
        // 3. 记录，用于生成测试报告
      }
    }
  }

  public async runGroup(target: IGroup, groupIndex: number, env: XBellEnv) {
    const cases = this.getValidCase(target.constructor, env.name);
    for (const [caseIndex, { caseName, propertyKey }] of Array.from(cases.entries())) {
      
      await this.runCase(target.constructor, propertyKey, env, {
        groupName: target.groupName as string,
        caseName: caseName as string,
        groupIndex,
        caseIndex,
        filename: target.filename,
      });
      // try {
      //   // prettyPrint.caseRuning(caseName);
        
      //   // prettyPrint.caseFinished(caseName)
      // } catch (error: any) {
      //   // console.log('error', error.message)
        
      //   // throw error;
      //   // prettyPrint.caseFailed(caseName);
      //   // console.log('error:', caseName, error)
      //   // 1. console 提示
      //   // 2. 错误代码栈展开
      //   // 3. 记录，用于生成测试报告
      // }
    }
  }

  public async runCase(constructor: Function, propertyKey: PropertyKey, envConfig: XBellEnv, {
    groupName,
    caseName,
    groupIndex,
    caseIndex,
    filename
  }: {
    groupName: string
    caseName: string
    groupIndex: number
    caseIndex: number
    filename: string
  }) {
    // const batchData = this.getBatchData(constructor, propertyKey, envConfig.name);
    // if (batchData) {
    //   if (!batchData?.length) {
    //     console.log('批量数据必须为数组格式');
    //   }
      const ctx = await this.initContext(envConfig, {
        groupName,
        caseName,
        groupIndex,
        caseIndex,
        filename,
        config: this.getMethodConfig(constructor, propertyKey),
      });

      // const reporter = this.reporterMap.get(envConfig.name) as Reporter;
      this.recorder.startCase(envConfig.name, groupIndex, caseIndex);
      // reporter.startCase(groupIndex, caseIndex);

      // console.log('_runCase:before');
      // for (let batchDataIndex = 0; batchDataIndex < batchData.length; batchDataIndex++) {
        try {
          await this._runCase(constructor, propertyKey, ctx, {
            isDepend: false,
            // batchDataIndex
          });
          // const coverageData = await ctx.page.evaluate(() => {
          //   return window.__coverage__;
          // });
          this.recorder.finishCase(envConfig.name, groupIndex, caseIndex);

          // reporter.finishCase(groupIndex, caseIndex);

        } catch(error: any) {
          this.recorder.wrongCase(envConfig.name, groupIndex, caseIndex, error);
          prettyPrint.printErrorStack(error);
        } finally {
          await this.destroyContext(ctx);
        }
      // }

    // } else {
    //   const ctx = await this.initContext(envConfig);
    //   await this._runCase(constructor, propertyKey, ctx, {
    //     isDepend: false,
    //   });
    //   await this.destroyContext(ctx);
    // }
  }

  protected async _runCase(constructor: Function, propertyKey: PropertyKey, ctx: Context, {
    isDepend = false,
    dependParams = [],
  }: {
    isDepend?: boolean
    dependParams?: any[]
  }) {
    const depends = this.getDepends(constructor, propertyKey);
    // 执行依赖
    for (const depend of depends) {
      await this._runCase(depend.targetConstructor, depend.targetPropertyKey, ctx, {
        isDepend: true,
        dependParams: depend.params,
      });
    }

    const instance = ctx.createInstance(constructor as new () => any);
    const beforeEachKeys = getMetadataKeys(MetaDataType.BeforeEachCase, instance);
    const afterEachKeys = getMetadataKeys(MetaDataType.AfterEachCase, instance);
    // 执行 beforeEach
    for (const methodKey of beforeEachKeys) {
      await instance[methodKey]();
    }

    const methodCustomDecorators = this.getCustomMethodDecorator(constructor, propertyKey);
    const classCustomDecorators = this.getCustomClassDecorator(constructor);
    // 用 pop 出来的执行，先 reverse
    const reverseCustomDecoratorCallbacks = [...classCustomDecorators, ...methodCustomDecorators].reverse()

    const batchData = this.getBatchData(constructor, propertyKey, ctx.envConfig.name);

    const runNextDecoratorCallback = async () => {
      const decorator = reverseCustomDecoratorCallbacks.pop()
      if (decorator) {
        await decorator.callback(ctx, runNextDecoratorCallback, ...decorator.parameters);
      } else {
        // 执行 case，判断是否批量数据
        if (batchData) {
          if (!batchData?.length) {
            console.log('批量数据必须为数组格式');
          }
          for (let batchDataIndex = 0; batchDataIndex < batchData.length; batchDataIndex++) {
            const params = isDepend ? this.parseDependParams(dependParams, ctx) : this.getMethodParams(instance, propertyKey, ctx, batchDataIndex);
            await instance[propertyKey](...params);
          }
        } else {
          const params = isDepend ? this.parseDependParams(dependParams, ctx) : this.getMethodParams(instance, propertyKey, ctx);
          await instance[propertyKey](...params);
        }
      }
    }


    // 执行所有自定义装饰器和 case
    await runNextDecoratorCallback();
    // 执行 afterEach
    for (const methodKey of afterEachKeys) {
      await instance[methodKey]();
    }
  }

  public parseDependParams<T>(params: any[] | MultiEnvData<T>[], ctx: Context) {
    const env = ctx.envConfig.name;
    return params.map(param => {
      return param?.[env!] ?? param;
    });
  }

  public isValidGroup(group: IGroup, env: XBellEnv['name']): boolean {
    const cases = this.getValidCase(group.constructor, env);
    // TODO: 环境
    return this.isExport(group.constructor) &&
      !!cases.length && (this.targetGroupName ? group.groupName === this.targetGroupName : true) &&
      !!this.getClassConfig(group.constructor).envs?.map(env => env.name).includes(env);
  }

  public async initContext(envConfig: XBellEnv, {
    groupName,
    caseName,
    groupIndex,
    caseIndex,
    config,
    filename
  }: {
    groupName: string;
    caseName: string;
    groupIndex: number;
    caseIndex: number;
    filename: string;
    config: XBellConfig;
  }) {
    const { viewport, headless } = config;
    const browser = await chromium.launch({
      headless: !!headless
    });
    const context = await browser.newContext({
      viewport,
      recordVideo: {
        dir: path.join(this.projectDirPath, '.xbell/records/', groupName, caseName),
        size: viewport,
        // size: {
        //   width: 800,
        //   height: 800,
        // }
      },
    })
    const page = await context.newPage();
    const ctx = new Context(envConfig, browser, page, this.projectDirPath, {
      caseName,
      groupName,
      caseIndex,
      groupIndex,
      filename,
    }, this.devServer);
    return ctx;
  }

  public async destroyContext(ctx: Context) {
    await ctx.page.close();
    
    const videoRelativePath = `records/${
      filenamify(ctx.caseInfo.groupName)
    }/${
      filenamify(ctx.caseInfo.caseName)
    }[${ctx.envConfig.name}].webm`;


    try {
      await ctx.page.video()?.saveAs(path.join(this.projectDirPath, this.htmlReportPath, videoRelativePath));
      this.recorder.addCaseVideoRecord(ctx.envConfig.name, ctx.caseInfo.groupIndex, ctx.caseInfo.caseIndex, videoRelativePath)
    } catch (error) {
      // no any video frames
    }

    await ctx.browser.close();
  }

  protected getMethodParams(instance: Object, propertyKey: string | symbol, ctx: Context, batchDataIndex?: number) {
    const parameters = getParameters(instance, propertyKey);
    const batchData = this.getBatchData(instance.constructor, propertyKey, ctx.envConfig.name);
    return parameters.map(({ type, index }) => {
      if (type === ParameterType.BatchData && batchDataIndex != null && batchData) {
        const ret = batchData[batchDataIndex];
        if (ret == null) {
          throw new Error('@BatchData(): ' + ctx.envConfig.name + '环境下无数据定义');
        }
        return ret;
      } else if (type === ParameterType.Data) {
        const data = Reflect.getMetadata(MetaDataType.Data, instance, propertyKey)
        const ret = data?.[ctx.envConfig.name];
        if (ret == null) {
          throw new Error('@Data(): ' + ctx.envConfig.name + '环境下无数据定义');
        }
        return ret;
      }
    });
  }

  public addExports(exports: any) {
    Object.values(exports).forEach((exp) => {
      this.exportMap.set(exp, true);
    });
  }

  public isExport(v: any): boolean {
    return !!this.exportMap.get(v);
  }

  public async runAllEnvs() {
    const { envs = [] } = this.bellConfig;
    if (!envs?.length) {
      console.log(chalk.red('启动环境未定义，请配置 xbell.config.ts 文件中 runEnvs 属性'));
      return;
    }
    await this.devServer;
    const recordData = envs.reduce((acc, env) => {
      acc[env.name] = this.initRecord(env.name);
      return acc;
    }, {} as Record<XBellEnv['name'], XBellGroupRecord[]>);

    this.recorder = new Recorder(recordData);
    if (!this.debug) {
      this.printer = new Printer(this.recorder);
      this.printer.start();
    }

    for (const env of envs) {
      if (!this.debug) {
        this.printer.setActiveEnv(env.name);
      }
      // const reporter = this.initReporter(env);
      // this.reporterMap.set(env, reporter);
      // reporter.startPrint();
      const config = this.bellConfig.envs.find(item => item.name === env.name)!;
      try {
        await this.runAllGroup(config);
      } catch (error) {
        // 
        throw error;
      } finally {
        // reporter.stopPrint();
      }
    }

    if (!this.debug) {
      this.printer.stop();
    }

    // gen html
    const html = generateHTML(this.recorder.records);
    fs.ensureDirSync(this.htmlReportPath)
    fs.writeFileSync(path.join(this.htmlReportPath, 'index.html'), html, 'utf-8');

    // remove .xbell folder
    // fs.rmSync(path.join(this.projectDirPath, '.xbell'), { recursive: true, force: true });
  }

  public async loadXBellConfig(): Promise<XBellConfig> {
    const bellConfigPath = path.join(this.projectDirPath, './xbell.config.ts');
    const fileExports =  await import (bellConfigPath);
    const config = fileExports?.default ?? fileExports;
    // 检验
    return {
      ...defaultXBellConfig,
      ...config
    };
  }

  // public loadEnvConfig(env: XBellEnv['name']): EnvConfig {
  //   const envFilePath = join(this.projectDirPath, 'src/envs', `env.${env}.ts`);
  //   const fileExports = require(envFilePath);
  //   const config = fileExports.default ?? fileExports;
  //   // TODO: 校验文件是否存在 & 有效
  //   return config;
  // }

  public async initConfig(
    projectDirPath: string,
    { groupName, caseName, debug, env }: Partial<{ groupName: string, caseName: string, debug?: boolean, env?: string }>
  ) {
    this.projectDirPath = projectDirPath;
    this.targetCaseName = caseName;
    this.targetGroupName = groupName;
    this.debug = !!debug;
    const config = await this.loadXBellConfig();
    const targetEnv = env && config.envs.find(envConfig => envConfig.name === env)
    this.bellConfig = {
      ...config,
      envs: targetEnv ? [targetEnv] : config.envs,
    };
  }

  public initRecord(env: XBellEnv['name']): XBellGroupRecord[] {
    const groupRecord: XBellGroupRecord[] = this.groups
    .filter(group => this.isValidGroup(group, env))
    .map(group => {
      const cases = this.getValidCase(group.constructor, env);
      const caseRecords: XBellCaseRecord[] = cases.map((c) => {
        return {
          caseName: c.caseName,
          status: 'waiting',
          videoRecords: [],
          groupName: group.groupName,
          browser: 'chromium',
          env,
        } as XBellCaseRecord;
      });
      return {
        groupName: group.groupName,
        cases: caseRecords,
        browser: 'chromium',
        env,
      } as XBellGroupRecord;
    });

    return groupRecord;
  }

  public async startDevServer(): Promise<ViteDevServer> {
    if (this.devServer) {
      return this.devServer;
    }
    this.devServer = startServer(this.projectDirPath);
    // (await this.devServer).pluginContainer.resolveId()
    // const protocol = server.httpServer?.protocol;
    
    return this.devServer;
  }

  public async stopDevServer() {
    if (!this.devServer) {
      return;
    }

    const server = await this.devServer;
    server.close();
  }
}

export const container = new Container();

// '🕙 enterpriseSearchSuccess'

// '✔️ ☑️ 🐎 ✅ enterpriseSearchSuccess'

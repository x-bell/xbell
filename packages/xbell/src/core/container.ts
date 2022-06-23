import { chromium } from 'playwright-core';
import { expect } from 'expect';
import * as fs from 'fs';
import { XBellCaseRecord, XBellGroupRecord, generateHTML } from 'xbell-reporter';
import { MetaDataType, ParameterType } from '../constants';
import { getParameters, getMetadataKeys, prettyPrint } from '../utils';
import { Context } from './context';
import { XBellConfig, IBatchData, PropertyKey, MultiEnvData } from '../types';
// import { Reporter, Status, CaseRecord, GroupRecord } from './reporter';
import { CreateDecorateorCallback } from './custom';
import filenamify = require('filenamify');
import * as path from 'path';
import * as chalk from 'chalk';
import { Recorder } from '../recorder';
import { Printer } from '../printer';

const defaultXBellConfig: Partial<XBellConfig> = {
  viewport: {
    width: 1380,
    height: 720,
  },
};
interface ICase {
  caseName: PropertyKey,
  propertyKey: PropertyKey
}

interface IGroup {
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
  public runEnvGroupMap = new Map<Function, EnvConfig['ENV'][]>();
  public runEvnCaseMap = new Map<Function, Map<PropertyKey, EnvConfig['ENV'][]>>();
  public targetGroupName?: string;
  public targetCaseName?: string;
  public debug!: boolean;
  public recorder!: Recorder;
  public printer!: Printer;
  // public envConfig: EnvConfig;
  // public reporterMap: Map<EnvConfig['ENV'], Reporter> = new Map();
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

  public getValidCase(constructor: Function, env: EnvConfig['ENV']): ICase[] {
    return this.targetCaseName
      ? this.getCases(constructor).filter(c => c.caseName === this.targetCaseName && this.getMethodConfig(constructor, c.propertyKey).runEnvs.includes(env))
      : this.getCases(constructor).filter(c => this.getMethodConfig(constructor, c.propertyKey).runEnvs.includes(env));
  }

  public setBatchData(constructor: Function, propertyKey: PropertyKey, data: IBatchData) {
    const propertyKeyMap = this.batchDataMap.get(constructor) || new Map<PropertyKey, IBatchData>();
    propertyKeyMap.set(propertyKey, data);
    this.batchDataMap.set(constructor, propertyKeyMap);
  }

  public getBatchData<T>(constructor: Function, propertyKey: PropertyKey, env: EnvConfig['ENV']): T[] {
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

  public async runAllGroup(envConfig: EnvConfig) {
    const exportGroups = this.groups.filter(group => this.isValidGroup(group, envConfig.ENV));
    for (const [groupIndex, group] of Array.from(exportGroups.entries())) {
      const cases = this.getValidCase(group.constructor, envConfig.ENV);
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

  public async runGroup(target: IGroup, groupIndex: number, envConfig: EnvConfig) {
    const cases = this.getValidCase(target.constructor, envConfig.ENV);
    for (const [caseIndex, { caseName, propertyKey }] of Array.from(cases.entries())) {
      
      await this.runCase(target.constructor, propertyKey, envConfig, {
        groupName: target.groupName as string,
        caseName: caseName as string,
        groupIndex,
        caseIndex
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

  public async runCase(constructor: Function, propertyKey: PropertyKey, envConfig: EnvConfig, {
    groupName,
    caseName,
    groupIndex,
    caseIndex
  }: {
    groupName: string
    caseName: string
    groupIndex: number
    caseIndex: number
  }) {
    // const batchData = this.getBatchData(constructor, propertyKey, envConfig.ENV);
    // if (batchData) {
    //   if (!batchData?.length) {
    //     console.log('批量数据必须为数组格式');
    //   }
      const ctx = await this.initContext(envConfig, {
        groupName,
        caseName,
        groupIndex,
        caseIndex,
        config: this.getMethodConfig(constructor, propertyKey),
      });

      // const reporter = this.reporterMap.get(envConfig.ENV) as Reporter;
      this.recorder.startCase(envConfig.ENV, groupIndex, caseIndex);
      // reporter.startCase(groupIndex, caseIndex);

      // console.log('_runCase:before');
      // for (let batchDataIndex = 0; batchDataIndex < batchData.length; batchDataIndex++) {
        try {
          await this._runCase(constructor, propertyKey, ctx, {
            isDepend: false,
            // batchDataIndex
          });
          this.recorder.finishCase(envConfig.ENV, groupIndex, caseIndex);
          // reporter.finishCase(groupIndex, caseIndex);

        } catch(error: any) {
          this.recorder.wrongCase(envConfig.ENV, groupIndex, caseIndex, error);
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

    const batchData = this.getBatchData(constructor, propertyKey, ctx.envConfig.ENV);

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
    const env = ctx.envConfig.ENV;
    return params.map(param => {
      return param?.[env!] ?? param;
    });
  }

  public isValidGroup(group: IGroup, env: EnvConfig['ENV']): boolean {
    const cases = this.getValidCase(group.constructor, env);
    // TODO: 环境
    return this.isExport(group.constructor) &&
      !!cases.length && (this.targetGroupName ? group.groupName === this.targetGroupName : true) &&
      !!this.getClassConfig(group.constructor).runEnvs?.includes(env);
  }

  public async initContext(envConfig: EnvConfig, {
    groupName,
    caseName,
    groupIndex,
    caseIndex,
    config
  }: {
    groupName: string;
    caseName: string;
    groupIndex: number;
    caseIndex: number;
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
    const ctx = new Context(envConfig, browser, page, expect, this.projectDirPath, {
      caseName,
      groupName,
      caseIndex,
      groupIndex,
    });
    return ctx;
  }

  public async destroyContext(ctx: Context) {
    await ctx.page.close();
    
    const videoRelativePath = `records/${
      filenamify(ctx.caseInfo.groupName)
    }/${
      filenamify(ctx.caseInfo.caseName)
    }[${ctx.envConfig.ENV}].webm`;


    try {
      await ctx.page.video()?.saveAs(path.join(this.projectDirPath, this.htmlReportPath, videoRelativePath));
      this.recorder.addCaseVideoRecord(ctx.envConfig.ENV, ctx.caseInfo.groupIndex, ctx.caseInfo.caseIndex, videoRelativePath)
    } catch (error) {
      // no any video frames
    }

    await ctx.browser.close();
  }

  protected getMethodParams(instance: Object, propertyKey: string | symbol, ctx: Context, batchDataIndex?: number) {
    const parameters = getParameters(instance, propertyKey);
    const batchData = this.getBatchData(instance.constructor, propertyKey, ctx.envConfig.ENV);
    return parameters.map(({ type, index }) => {
      if (type === ParameterType.BatchData && batchDataIndex != null && batchData) {
        const ret = batchData[batchDataIndex];
        if (ret == null) {
          throw new Error('@BatchData(): ' + ctx.envConfig.ENV + '环境下无数据定义');
        }
        return ret;
      } else if (type === ParameterType.Data) {
        const data = Reflect.getMetadata(MetaDataType.Data, instance, propertyKey)
        const ret = data?.[ctx.envConfig.ENV];
        if (ret == null) {
          throw new Error('@Data(): ' + ctx.envConfig.ENV + '环境下无数据定义');
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
    const { runEnvs = [] } = this.bellConfig;
    if (!runEnvs?.length) {
      console.log(chalk.red('启动环境未定义，请配置 xbell.config.ts 文件中 runEnvs 属性'));
      return;
    }

    const recordData = runEnvs.reduce((acc, env) => {
      acc[env] = this.initRecord(env);
      return acc;
    }, {} as Record<EnvConfig['ENV'], XBellGroupRecord[]>);

    this.recorder = new Recorder(recordData);
    this.printer = new Printer(this.recorder);
    this.printer.start();

    for (const env of runEnvs) {
      this.printer.setActiveEnv(env);
      // const reporter = this.initReporter(env);
      // this.reporterMap.set(env, reporter);
      // reporter.startPrint();
      const config = this.bellConfig.envConfig[env]!;
      try {
        await this.runAllGroup(config);
      } catch (error) {
        // 
        throw error;
      } finally {
        // reporter.stopPrint();
      }
    }

    this.printer.stop();

    // gen html
    const html = generateHTML(this.recorder.records);
    fs.writeFileSync(path.join(this.htmlReportPath, 'index.html'), html, 'utf-8');

    // remove .xbell folder
    fs.rmSync(path.join(this.projectDirPath, '.xbell'), { recursive: true, force: true });
  }

  public loadXBellConfig(): XBellConfig {
    const bellConfigPath = path.join(this.projectDirPath, './xbell.config.ts');
    const fileExports = require(bellConfigPath);
    const config = fileExports?.default ?? fileExports;
    // 检验
    return {
      ...defaultXBellConfig,
      ...config
    };
  }

  // public loadEnvConfig(env: EnvConfig['ENV']): EnvConfig {
  //   const envFilePath = join(this.projectDirPath, 'src/envs', `env.${env}.ts`);
  //   const fileExports = require(envFilePath);
  //   const config = fileExports.default ?? fileExports;
  //   // TODO: 校验文件是否存在 & 有效
  //   return config;
  // }

  public initConfig(
    projectDirPath: string,
    { groupName, caseName, debug, env }: Partial<{ groupName: string, caseName: string, debug?: boolean, env?: string }>
  ) {
    this.projectDirPath = projectDirPath;
    this.targetCaseName = caseName;
    this.targetGroupName = groupName;
    this.debug = !!debug;
    const config = this.loadXBellConfig();
    this.bellConfig = {
      ...config,
      runEnvs: env ? [env as EnvConfig['ENV']] : config.runEnvs,
    };
  }

  public initRecord(env: EnvConfig['ENV']): XBellGroupRecord[] {
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
}

export const container = new Container();

// '🕙 enterpriseSearchSuccess'

// '✔️ ☑️ 🐎 ✅ enterpriseSearchSuccess'


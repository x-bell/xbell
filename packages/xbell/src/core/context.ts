import { Browser, Page } from 'playwright-core';
import { Expect } from 'expect';
import { getMetadataKeys } from '../utils';
import { MetaDataType } from '../constants';
// import { EnvConfig } from '../env';
// import { getDestroyKeys } from './destroy';

type Step<T> = <R>(stepDescription: string, callback: (v: T) => R) => Promise<Step<Awaited<R>>>
export class Context {

  protected _currentStep?: string;
  protected prevPages: Page[] = []

  constructor(
    public envConfig: EnvConfig,
    public browser: Browser,
    public page: Page,
    public expect: Expect,
    public rootDir: string,
    public caseInfo: {
      groupName: string;
      caseName: string;
      groupIndex: number;
      caseIndex: number;
    }
  ) {}

  /**
   * 创建实例，并自动注入依赖 & 上下文
   * @param constructor 类
   * @returns 实例
   */
  public createInstance<T>(constructor: new () => T): T {
    const instance = new constructor()
    const initKeys = getMetadataKeys(MetaDataType.Init, instance)
    const injectKeys = getMetadataKeys(MetaDataType.Inject, instance)
    // 依赖
    injectKeys.forEach((propertyKey) => {
      try {
        const InjectConstructor = Reflect.getMetadata('design:type', instance, propertyKey);
        const isInjectCtx = InjectConstructor === Context;
        // console.log('propertyKey:', propertyKey, InjectConstructor, InjectConstructor === Context);
        // @ts-ignore
        instance[propertyKey] = isInjectCtx ? this : this.createInstance(InjectConstructor);
      } catch(error) {
        console.log(`${constructor.name} 实例 ${propertyKey.toString()}  属性初始化失败，检查是否由 Inject 使用错误引起`)
        throw error;
      }
    })

    // 执行 @Init 装饰的方法
    initKeys.forEach((methodKey) => {
      // @ts-ignore
      instance[methodKey]();
    })

    return instance;
  }

  public async switchToNewPage() {
    this.prevPages = [...this.prevPages, this.page]
    const page = await this.page.context().waitForEvent('page')
    this.page = page;
  }

  protected _genStep<T>(v: T)  {
    const nextStep: Step<T> = async <R>(stepDescription: string, callback: (v: T) => R) => {
      // const readlV: Await<T> = await v;
      // TODO: 记录档期那
      const returnValue: Awaited<R> = await callback(v)
      return this._genStep(returnValue)
    }

    return nextStep
  }

  public step = this._genStep(undefined)
}


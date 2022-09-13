import { XBellTestCaseClassic } from '../types/index';
import { getMetadataKeys } from '../utils/index';
import { MetaDataType } from '../constants/index';
import { XBellPage } from '../types';
import { Page } from './page';


export class ClassicContext {
  protected _injectMap = new Map<Function, any>();
  protected _internalMap = new Map()
  constructor(
    protected _case: XBellTestCaseClassic,
    protected _page: XBellPage<any>,
  ) {
    this._internalMap.set(Page, this._page);
  }

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
        // @ts-ignore
        instance[propertyKey] = isInjectCtx ? this : this.createInstance(InjectConstructor);
      } catch(error: any) {
        const err = new Error();
        err.message = [
          error.message,
          `Failed to inject ${propertyKey.toString()}, If you are using "constructor", replace it with "@Init()" decorator.`,
        ].filter(Boolean).join('\n');
        err.stack = error.stack;
        err.name = error.name;
        throw err;
      }
    })

    // 执行 @Init 装饰的方法
    initKeys.forEach((methodKey) => {
      // @ts-ignore
      instance[methodKey]();
    });

    return instance;
  }

  protected getInectValue({
    instance,
    propertyKey,
  }: {
    instance: any;
    propertyKey: string;
  }) {
    const InjectConstructor = Reflect.getMetadata('design:type', instance, propertyKey);
    const injectValue = this._injectMap.get(InjectConstructor) ?? this._initInjectValue({
      instance,
      propertyKey
    });
    this._injectMap.set(InjectConstructor, injectValue);
    return injectValue;
  }

  protected _initInjectValue({
    instance,
    propertyKey,
  }: {
    instance: any;
    propertyKey: string;
  }) {
    const InjectConstructor = Reflect.getMetadata('design:type', instance, propertyKey);
    const isInjectCtx = InjectConstructor === ClassicContext;
    if (isInjectCtx) {
      return this;
    }

    return this._internalMap.get(InjectConstructor) ?? this.createInstance(InjectConstructor);

  }
}

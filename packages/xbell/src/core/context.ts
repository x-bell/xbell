import { Browser, Locator, Page, PageScreenshotOptions } from 'playwright-core';
import { expect as jexpect, Expect as JExpect } from 'expect';
import { ExpectType } from '../types';
import { getMetadataKeys } from '../utils';
import { MetaDataType } from '../constants';
import { XBellLocator, XBellPage } from '../types/page';
import { toMatchSnapshot, ToMatchSnapshotOptions, ScreenshotTarget } from './snapshot';

type Step<T> = <R>(stepDescription: string, callback: (v: T) => R) => Promise<Step<Awaited<R>>>
export class Context {

  protected _currentStep?: string;
  protected prevPages: Page[] = []

  public page: XBellPage;

  public expect: ExpectType;

  constructor(
    public envConfig: EnvConfig,
    public browser: Browser,
    page: Page,
    public rootDir: string,
    public caseInfo: {
      groupName: string;
      caseName: string;
      groupIndex: number;
      caseIndex: number;
    }
  ) {
    this.expect = this._extendExpect(jexpect);
    this.page = this._extendPage(page);
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
    this.page = this._extendPage(page);
  }

  protected _extendExpect(expect: JExpect): ExpectType {
    const ctx = this;
    expect.extend({
      async toMatchSnapshot (
        this: ReturnType<JExpect['getState']>,
        received: ScreenshotTarget,
        {
          name,
          maxDiffPixels,
          maxDiffPixelRatio,
          threshold,
        }: ToMatchSnapshotOptions) {
        return toMatchSnapshot(ctx, received, { maxDiffPixelRatio, maxDiffPixels, name, threshold })
      }
    })

    return expect as ExpectType;
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

  protected _extendLocator(locator: Locator): XBellLocator {
    this._extendQuery(locator);
    const rawNth = locator.nth;
    const rawFirst = locator.first;
    const rawLast = locator.last;
    locator.nth = (index: number) => {
      return this._extendLocator(
        rawNth.apply(locator, [index])
      )
    }

    locator.first = () => {
      return this._extendLocator(rawFirst.apply(locator));
    }

    locator.last = () => {
      return this._extendLocator(rawLast.apply(locator));
    }

    return locator as XBellLocator;
  }

  protected _extendQuery(page: Page): XBellPage;

  protected _extendQuery(page: Locator): XBellLocator;

  protected _extendQuery(page: Page | Locator): XBellPage | XBellLocator {
    const rawLocator = page.locator;
    const ctx = this;
    page.locator = function (...args) {
      return ctx._extendLocator(
        rawLocator.apply(this, args)
      )
    }
    // @ts-ignore
    page.queryByText = (text: string) => {
      return this._extendLocator(page.locator(`text=${text}`));
    }

    // @ts-ignore
    page.queryByClass = (className: string, tagType: string = '') => {
      const cls = className.startsWith('.') ? className : `.${className}`
      return this._extendLocator(page.locator(`${tagType}${cls}`));
    }

    // @ts-ignore
    page.queryByTestId = (testId: string, tagType: string = '') => {
      return this._extendLocator(page.locator(`${tagType}[data-testid=${testId}]`));
    };

    // @ts-ignore
    page.queryByPlaceholder = (placeholder: string, tagType: string = '') => {
      return this._extendLocator(page.locator(`${tagType}[placeholder="${placeholder}"]`));
    }

    // @ts-ignore
    page.queryById = (id: string) => {
      return this._extendLocator(page.locator(`#${id}`));
    }

    return page as XBellPage | XBellLocator;
  }

  protected _extendPage(page: Page) {
    this._extendQuery(page);
    return page as XBellPage;
  }

  public step = this._genStep(undefined)
}


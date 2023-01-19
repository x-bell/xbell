import type { ElementHandle as ElementHandleInterface, Locator as LocatorInterface, FrameLocator as FrameLocatorInterface } from '../types';
import type { ElementHandleCheckOptions, ElementHandleClickOptions, ElementHandleDblclickOptions, ElementHandleHoverOptions, ElementHandleScreenshotOptions, ElementHandleUncheckOptions, Rect, TimeoutOptions } from '../types/pw';
import type { QueryItem, LocatorRPCMethods } from './types';
import { getElementHandle } from './element-handle';

// TODO: browser-native impl

export class Locator implements LocatorInterface {
  private _uuid?: Promise<string>;
  // @internal
  _type = 'locator' as const;

  constructor(private queryItems: QueryItem[]) {
  }

  // @internal
  _getUUID() {
    return this._connectToLocator();
  }

  private async _connectToLocator() {
    if (!this._uuid) {
      this._uuid = window.__xbell_page_locator_expose__(this.queryItems).then(res => res.uuid);
    }

    return this._uuid!;
  }


  private async _execute<T extends keyof LocatorInterface>(
    method: T,
    ...args: Parameters<LocatorInterface[T]>
    ): Promise<ReturnType<LocatorInterface[T]>> {
    const uuid = await this._connectToLocator();
    return window.__xbell_page_locator_execute__({
      uuid,
      method,
      args,
    });
  }


  private async _executeRPC<T extends keyof LocatorRPCMethods>(
    method: T,
    ...args: Parameters<LocatorRPCMethods[T]>
    ): Promise<ReturnType<LocatorRPCMethods[T]>> {
    const uuid = await this._connectToLocator();
    return window.__xbell_page_locator_rpc_execute__({
        uuid,
        method,
        args,
      }) as ReturnType<LocatorRPCMethods[T]>;
  }

  private appendQueryItem(queryItem: QueryItem) {
    return [...this.queryItems, queryItem];
  }

  get(selector: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ value: selector }));
  }

  getByText(text: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ type: 'text', value: text }));
  }

  getByClass(className: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ type: 'class', value: className }));
  }

  getByTestId(testId: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ type: 'testId', value: testId }));
  }

  getById(id: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ type: 'id', value: id }));
  }


  first(): LocatorInterface {
    return new Locator(this.appendQueryItem({ method: 'first', args: [] }));
  }

  last(): LocatorInterface {
    return new Locator(this.appendQueryItem({ method: 'last', args: [] }));
  }

  nth(index: number): LocatorInterface {
    return new Locator(this.appendQueryItem({ method: 'nth', args: [index] }));
  }

  getFrame(selector: string): FrameLocator {
    return new FrameLocator(this.appendQueryItem({ isFrame: true, value: selector }));
  }

  async queryElementByClass(className: string): Promise<ElementHandleInterface | null> {
    return getElementHandle(this.appendQueryItem({ type: 'class', value: className, isElementHandle: true }));
  }

  async queryElementByTestId(testId: string): Promise<ElementHandleInterface | null> {
    return getElementHandle(this.appendQueryItem({ type: 'testId', value: testId, isElementHandle: true }));
  }

  async queryElementByText(text: string): Promise<ElementHandleInterface | null> {
    return getElementHandle(this.appendQueryItem({ type: 'text', value: text, isElementHandle: true }));
  }

  async boundingBox(options?: TimeoutOptions | undefined): Promise<Rect | null> {
    return await this._execute('boundingBox', options);
  }
  
  async screenshot(options?: ElementHandleScreenshotOptions | undefined): Promise<Buffer> {
    return await this._execute('screenshot', options);
  }

  async focus(options?: TimeoutOptions | undefined): Promise<void> {
    await this._execute('focus', options);
  }

  async click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    await this._execute('click', options);
  }

  async dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    await this._execute('dblclick', options);
  }

  async fill(value: string, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    await this._execute('fill', value, options);
  }

  async hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    await this._execute('hover', options);
  }

  async check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    await this._execute('check', options);
  }

  async uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    await this._execute('uncheck', options);
  }

  async isHidden(options?: TimeoutOptions | undefined): Promise<boolean> {
    return await this._execute('isHidden', options);
  }

  async isVisible(options?: TimeoutOptions | undefined): Promise<boolean> {
    return await this._execute('isVisible', options);
  }

  async isChecked(options?: TimeoutOptions | undefined): Promise<boolean> {
    return await this._execute('isChecked', options);
  }

  async isDisabled(options?: TimeoutOptions | undefined): Promise<boolean> {
    return await this._execute('isDisabled', options);
  }

  async setInputFiles(files: string | string[] | { name: string; mimeType: string; buffer: Buffer; } | { name: string; mimeType: string; buffer: Buffer; }[], options?: { noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    return await this._execute('setInputFiles', files, options);
  }

  // async waitFor(options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden' | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
  //   return await this._execute('waitFor', options);
  // }

  async waitForHidden(options?: TimeoutOptions | undefined): Promise<void> {
    return await this._execute('waitForHidden', options);
  }

  async waitForVisible(options?: TimeoutOptions | undefined): Promise<void> {
    return await this._execute('waitForVisible', options);
  }

  async count(): Promise<number> {
    return await this._execute('count');
  }

  async textContent(options?: TimeoutOptions | undefined): Promise<string | null> {
    return await this._execute('textContent', options);
  }

  async queryAttribute(name: string, options?: TimeoutOptions | undefined): Promise<string | null> {
    return await this._execute('queryAttribute', name, options)
  }

  async dragTo(target: LocatorInterface, options?: { sourcePosition?: { x: number; y: number; } | undefined; targetPosition?: { x: number; y: number; } | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    const targetUUID = await (target as Locator)._getUUID();
    return await this._executeRPC('rpcDragTo', { uuid: targetUUID }, options);
  }

  async innerHTML(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    return await this._execute('innerHTML', options);
  }

  async innerText(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    return await this._execute('innerText', options);
  }

  async inputValue(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    return await this._execute('inputValue', options);
  }

  async selectText(options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    return await this._execute('selectText', options);
  }
}

export class FrameLocator implements FrameLocatorInterface {
  private _uuid?: Promise<string>;

  constructor(private queryItems: QueryItem[]) {
  }

  private async _connectToLocator() {
    if (!this._uuid) {
      this._uuid = window.__xbell_page_locator_expose__(this.queryItems).then(res => res.uuid);
    }

    return this._uuid!;
  }

  private async _execute<T extends keyof FrameLocatorInterface>(method: T, ...args: Parameters<FrameLocatorInterface[T]>): Promise<ReturnType<FrameLocatorInterface[T]>> {
    const uuid = await this._connectToLocator();

    return window.__xbell_page_locator_execute__({
      uuid,
      method,
      args,
    });
  }

 
  private appendQueryItem(queryItem: QueryItem) {
    return [...this.queryItems, queryItem];
  }

  get(selector: string): LocatorInterface {
    return new Locator(this.appendQueryItem({ value: selector }));
  }

  getByText(text: string): LocatorInterface {
    return  new Locator(this.appendQueryItem({ type: 'text', value: text }));
  }

  getByClass(className: string): LocatorInterface {
    return  new Locator(this.appendQueryItem({ type: 'class', value: className }));
  }

  getByTestId(testId: string): LocatorInterface {
    return  new Locator(this.appendQueryItem({ type: 'testId', value: testId }));
  }

  getById(id: string): LocatorInterface {
    return  new Locator(this.appendQueryItem({ type: 'id', value: id }));
  }

  first(): FrameLocatorInterface {
    return new FrameLocator(this.appendQueryItem({ method: 'first', args: [] }))
  }

  last(): FrameLocatorInterface {
    return new FrameLocator(this.appendQueryItem({ method: 'last', args: [] }));
  }

  nth(index: number): FrameLocatorInterface {
    return new FrameLocator(this.appendQueryItem({ method: 'nth', args: [index] }))
  }
  
  getFrame(selector: string): FrameLocatorInterface {
    return new FrameLocator(this.appendQueryItem({ isFrame: true, value: selector }));
  }
}

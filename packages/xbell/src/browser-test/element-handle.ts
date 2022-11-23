import type { ElementHandle as ElementHandleInterface } from '../types';
import type { QueryItem } from './types';
import type { ElementHandleCheckOptions, ElementHandleClickOptions, ElementHandleDblclickOptions, ElementHandleHoverOptions, ElementHandleScreenshotOptions, ElementHandleUncheckOptions, Rect } from '../types/pw';


export async function getElementHandle(queryItems: QueryItem[], uuid?: string) {
  const ret = await window.__xbell_page_element_handle_expose__(queryItems, uuid); 

  if (ret?.uuid) {
    return new ElementHandle(ret.uuid);
  }

  return null;

}

export class ElementHandle implements ElementHandleInterface {
  // @internal
  private _type = 'element';

  constructor(private _uuid: string) {}

  // @internal
  private _getUUID() {
    return this._uuid;
  }

  private async _execute<T extends keyof ElementHandleInterface>(method: T, ...args: Parameters<ElementHandleInterface[T]>): Promise<ReturnType<ElementHandleInterface[T]>> {
    return window.__xbell_page_element_handle_execute__({
      uuid: this._uuid,
      method,
      args,
    });
  }

  async boundingBox(): Promise<Rect | null> {
    return await this._execute('boundingBox');
  }

  async screenshot(options?: ElementHandleScreenshotOptions | undefined): Promise<Buffer> {
    return await this._execute('screenshot', options);
  }

  async hover(options?: ElementHandleHoverOptions | undefined): Promise<void> {
    return await this._execute('hover', options);
  }

  async focus(): Promise<void> {
    return await this._execute('focus');
  }

  async click(options?: ElementHandleClickOptions | undefined): Promise<void> {
    return await this._execute('click', options);
  }

  async dblclick(options?: ElementHandleDblclickOptions | undefined): Promise<void> {
    return await this._execute('dblclick', options);
  }

  async check(options?: ElementHandleCheckOptions | undefined): Promise<void> {
    return await this._execute('check', options);
  }

  async uncheck(options?: ElementHandleUncheckOptions | undefined): Promise<void> {
    return await this._execute('uncheck', options);
  }
  async isDisabled(): Promise<boolean> {
    return await this._execute('isDisabled');
  }

  async isChecked(): Promise<boolean> {
    return await this._execute('isChecked');
  }

  async isHidden(): Promise<boolean> {
    return await this._execute('isHidden');    
  }

  async isVisible(): Promise<boolean> {
    return await this._execute('isVisible');    
  }

  queryElementByClass(className: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'class',
      value: className,
      isElementHandle: true,
    }], this._uuid);
  }

  queryElementByTestId(testId: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'testId',
      value: testId,
      isElementHandle: true,
    }], this._uuid);
  }

  queryElementByText(text: string): Promise<ElementHandleInterface | null> {
    return getElementHandle([{
      type: 'text',
      value: text,
      isElementHandle: true,
    }], this._uuid);
  }
}


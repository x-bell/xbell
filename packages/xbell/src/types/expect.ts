
import type { ExpectMatchObject, ExpectMatchFunctionReturnPromiseFunction, expect } from '@xbell/assert';
import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import type { Locator } from './locator';;
import type { ElementHandle } from './element-handle';
import type { CommonPage } from './page';
import type { TimeoutOptions } from './pw';

export interface E2EMatcher extends ExpectMatchObject {
  toBeChecked: (received: Locator | ElementHandle, options?: TimeoutOptions) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toBeDisabled: (received: Locator | ElementHandle, options?: TimeoutOptions) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toBeVisible: (received: Locator | ElementHandle, options?: TimeoutOptions) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toBeHidden: (received: Locator | ElementHandle, options?: TimeoutOptions) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toMatchImageScreenshot: (received: Uint8Array | Buffer, options: ToMatchImageSnapshotOptions | string) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toMatchSnapshot: (received: any, options: ToMatchJavaScriptSnapshotOptions | string) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toThrowErrorMatchingSnapshot: (received: Function | Error, options: ToMatchJavaScriptSnapshotOptions) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
  toMatchScreenshot: (received: Locator | ElementHandle | CommonPage, options: ToMatchImageSnapshotOptions | string) => ReturnType<ExpectMatchFunctionReturnPromiseFunction>;
}


export type Expect = ReturnType<typeof expect.extend<E2EMatcher>>;

import type { Locator } from '../types/locator';

export type PageSyncMethodKeys = 'get' | 'getByClass' | 'getByTestId' | 'getByText' | 'getFrame';
export type LocatorSyncMethodKeys = 'first' | 'nth' | 'last' | PageSyncMethodKeys;

export type LocatorMethod<T extends LocatorSyncMethodKeys = LocatorSyncMethodKeys> = {
  method: T;
  args: Parameters<Locator[T]>;
}

export type SelectorItem = {
  type?: 'text' | 'testId' | 'class' | 'role' | 'title' | 'title';
  value: string;
  isFrame?: boolean;
  isElementHandle?: boolean;
};

export type QueryItem = LocatorMethod | SelectorItem;

export interface LocatorRPCMethods {
  rpcDragTo(target: { uuid: string }, options: Parameters<Locator['dragTo']>[1]): Promise<void>
}

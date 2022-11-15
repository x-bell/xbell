import type { Locator } from '../types/locator';

type LocatorMethodKeys = 'first' | 'nth' | 'last';

type LocatorMethod<T extends LocatorMethodKeys> = {
  method: T;
  args: Parameters<Locator[T]>;
}

export type SelectorItem = {
  type?: 'text' | 'testId' | 'class' | 'role' | 'title' | 'title';
  value: string;
  isFrame?: boolean;
};

export type QueryItem<T = any> = T extends LocatorMethodKeys ? LocatorMethod<T> : SelectorItem;

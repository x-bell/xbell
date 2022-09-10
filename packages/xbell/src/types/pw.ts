export type { Response } from 'playwright-core';

export type Size = { width: number, height: number };
export type Point = { x: number, y: number };
export type Rect = Size & Point;
export type Quad = [ Point, Point, Point, Point ];
export type URLMatch = string | RegExp | ((url: URL) => boolean);
export type TimeoutOptions = { timeout?: number };
export type NameValue = { name: string, value: string };
export type HeadersArray = NameValue[];

export type ElementHandleClickOptions = {
  force?: boolean,
  noWaitAfter?: boolean,
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[],
  position?: Point,
  delay?: number,
  button?: 'left' | 'right' | 'middle',
  clickCount?: number,
  timeout?: number,
  trial?: boolean,
};

export type ElementHandleCheckOptions = {
  force?: boolean,
  noWaitAfter?: boolean,
  position?: Point,
  timeout?: number,
  trial?: boolean,
};

export type ElementHandleDblclickOptions = {
  force?: boolean,
  noWaitAfter?: boolean,
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[],
  position?: Point,
  delay?: number,
  button?: 'left' | 'right' | 'middle',
  timeout?: number,
  trial?: boolean,
};

export type ElementHandleHoverOptions = {
  force?: boolean,
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[],
  position?: Point,
  timeout?: number,
  trial?: boolean,
};

export type ElementHandleUncheckOptions = {
  force?: boolean,
  noWaitAfter?: boolean,
  position?: Point,
  timeout?: number,
  trial?: boolean,
};

export type LifecycleEvent = 'load' | 'domcontentloaded' | 'networkidle' | 'commit';


export type FrameGotoOptions = {
  timeout?: number,
  waitUntil?: LifecycleEvent,
  referer?: string,
  html?: string;
};


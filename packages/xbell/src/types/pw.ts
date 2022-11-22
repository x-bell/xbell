
import type { JSHandle, ElementHandle } from 'playwright-core';

export type { Video, Download } from 'playwright-core';

export type Request = {
  headers: { [key: string]: string; };
  url: string;
}

export type Response = {
  headers: { [key: string]: string; };
  url: string;
  status: number;
}

export type StorageState = {
  cookies: Array<{
    name: string;

    value: string;

    domain: string;

    path: string;

    /**
     * Unix time in seconds.
     */
    expires: number;

    httpOnly: boolean;

    secure: boolean;

    sameSite: "Strict"|"Lax"|"None";
  }>;

  origins: Array<{
    origin: string;

    localStorage: Array<{
      name: string;

      value: string;
    }>;
  }>;
}

export type SmartHandle<T> = T extends Node ? ElementHandle<T> : JSHandle<T>;

export type NoHandles<Arg> = Arg extends JSHandle ? never : (Arg extends object ? { [Key in keyof Arg]: NoHandles<Arg[Key]> } : Arg);

export type Unboxed<Arg> =
  Arg extends ElementHandle<infer T> ? T :
  Arg extends JSHandle<infer T> ? T :
  Arg extends NoHandles<Arg> ? Arg :
  Arg extends [infer A0] ? [Unboxed<A0>] :
  Arg extends [infer A0, infer A1] ? [Unboxed<A0>, Unboxed<A1>] :
  Arg extends [infer A0, infer A1, infer A2] ? [Unboxed<A0>, Unboxed<A1>, Unboxed<A2>] :
  Arg extends [infer A0, infer A1, infer A2, infer A3] ? [Unboxed<A0>, Unboxed<A1>, Unboxed<A2>, Unboxed<A3>] :
  Arg extends Array<infer T> ? Array<Unboxed<T>> :
  Arg extends object ? { [Key in keyof Arg]: Unboxed<Arg[Key]> } :
  Arg;

export type PageFunction0<R> = string | (() => R | Promise<R>);

export type PageFunction<Arg, R> = string | ((arg: Unboxed<Arg>) => R | Promise<R>);

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
  mockHTML?: string;
};

export type ElementHandleScreenshotOptions = {
  timeout?: number,
  type?: 'png' | 'jpeg',
  quality?: number,
  omitBackground?: boolean,
  caret?: 'hide' | 'initial',
  animations?: 'disabled' | 'allow',
  scale?: 'css' | 'device',
  path?: string,
};

export type PageScreenshotOptions = {
  timeout?: number,
  type?: 'png' | 'jpeg',
  quality?: number,
  fullPage?: boolean,
  clip?: Rect,
  omitBackground?: boolean,
  caret?: 'hide' | 'initial',
  animations?: 'disabled' | 'allow',
  scale?: 'css' | 'device',
  path?: string,
};

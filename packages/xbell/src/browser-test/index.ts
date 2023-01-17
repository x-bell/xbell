import { spyOn, fn } from '@xbell/assert';
import { Page } from './page';
import { expect } from './expect';
import type { Expect } from '../types';

export const importActual: <T = any>(path: string) => Promise<T> = window.__xbell_context__.importActual;

export const sleep = (duration: number) => new Promise<void>(r => setTimeout(r, duration));

export {
  fn,
  spyOn,
  expect,
};

export const page = new Page();

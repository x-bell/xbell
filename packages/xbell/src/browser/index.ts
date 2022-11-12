import { spyOn, fn, expect } from '@xbell/assert';
import { Page } from './page';

export const importActual: <T = any>(path: string) => Promise<T> = window.__xbell_context__.importActual;

export {
  fn,
  spyOn,
  expect,
};

export const page = new Page();

export type BrowserTestArguments = {
  fn: typeof fn,
  spyOn: typeof spyOn,
  expect: typeof expect
  importActual: typeof importActual,
  page: Page,
}


import { spyOn, fn, expell, defineMatcher } from 'expell';
import { Page } from './page';

export const importActual: <T = any>(path: string) => Promise<T> = window.__xbell_context__.importActual;

export const expect = expell;

export {
  fn,
  spyOn,
};

export const page = new Page();

export type BrowserTestArguments = {
  fn: typeof fn,
  spyOn: typeof spyOn,
  expect: typeof expell
  importActual: typeof importActual,
  page: Page,
}


import { spyOn, fn, expell } from 'expell';

export const importActual = window.__xbell_context__.importActual;

export const expect = expell;
export {
  fn,
  spyOn,
};

export type BrowserTestArguments = {
  fn: typeof fn,
  spyOn: typeof spyOn,
  expect: typeof expell
  importActual: typeof importActual,
}


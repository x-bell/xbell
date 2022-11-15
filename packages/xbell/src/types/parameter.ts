import type { fn, spyOn } from '@xbell/assert';
import type { ParameterType } from '../constants/index'
import type { XBellTestCaseFunctionArguments } from './test';
import type { XBellProject } from './config';
import type { Page } from '../worker/page';
import type { Expect } from '../worker/expect/expect';

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

export interface TestArguments extends XBellTestCaseFunctionArguments {
  page: Page;
  project: XBellProject;
  expect: Expect;
  fn: typeof fn;
  spyOn: typeof spyOn;
}

export interface TestEachArguments<T = any> extends TestArguments {
  item: T;
}

export interface TestBatchArguments<T = any> extends TestArguments {
  item: T;
}

export type TestFixtureArguments<T = {}>  = TestArguments & T;

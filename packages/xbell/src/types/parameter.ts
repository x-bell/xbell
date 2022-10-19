import type { ParameterType } from '../constants/index'
import type { XBellTestCaseFunctionArguments } from './test';
import type { XBellProject } from './config';
import type { Page } from '../worker/page';

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

export interface TestArguments<BrowserExtensionArg = {}> extends XBellTestCaseFunctionArguments<BrowserExtensionArg> {
}

export interface TestEachArguments<T = any> extends TestArguments {
  item: T;
}

export interface TestBatchArguments<T = any> extends TestArguments {
  item: T;
}

export type TestFixtureArguments<T = {}>  = TestArguments & T;

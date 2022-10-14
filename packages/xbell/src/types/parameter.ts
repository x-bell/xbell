import type { ParameterType } from '../constants/index'
import type { XBellPage, XBellTestCaseFunctionArguments } from './test';
import type { XBellProject } from './config';

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

export interface TestArguments<BrowserExtensionArg = {}> extends XBellTestCaseFunctionArguments<BrowserExtensionArg> {
  page: XBellPage;
  project: XBellProject;
}

export interface TestEachArguments<T = any> extends TestArguments {
  item: T;
}

export interface TestBatchArguments<T = any> extends TestArguments {
  item: T;
}

export type TestFixtureArguments<T = {}>  = TestArguments & T;

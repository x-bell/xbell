import type { ParameterType } from '../constants/index'
import type { NodeJSTestArguments } from './test';

export interface IParameter {
  type: ParameterType;
  index: number;
}

export type PropertyKey = symbol | string;

export interface TestArguments extends NodeJSTestArguments {}

export interface TestEachArguments<T = any> extends TestArguments {
  item: T;
}

export interface TestBatchArguments<T = any> extends TestArguments {
  item: T;
}

export type TestFixtureArguments<T = {}>  = TestArguments & T;

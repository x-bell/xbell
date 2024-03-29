import type { ConditionResult, ConditionType } from './utils'

export interface ExpectMatchState {
  not: boolean;
  resolves: boolean;
  rejects: boolean;
}

export type ExpectMatchResult = { pass: boolean | ((state: ExpectMatchState) => (boolean | Promise<boolean>)), message: ((state: ExpectMatchState) => string) | string };

export type ExpectMatchNormalFunction = (...args: any) => ExpectMatchResult;

export type ExpectMatchPromiseFunction = (...args: any) => Promise<ExpectMatchResult>;

export type ExpectMatchFunctionReturnFunction = (...args: any) => (state: ExpectMatchState) => ExpectMatchResult;

export type ExpectMatchFunctionReturnPromiseFunction = (...args: any) => (state: ExpectMatchState) => Promise<ExpectMatchResult>;

export type ExpectMatchFunction = ExpectMatchNormalFunction | ExpectMatchPromiseFunction | ExpectMatchFunctionReturnFunction | ExpectMatchFunctionReturnPromiseFunction;

export interface ExpectMatchObject {
  [key: string]: ExpectMatchFunction;
}

// type ReceivedParameters<Received, Fun extends Function> =
//   Fun extends <R extends Received>(received: R, expected: R, ...args: infer P) => any
//     ? <R extends Received>(expected: R, ...args: P) => void
//     : Fun;

// MatchObject[Key] extends (received: Received, ...args: infer P) => (state: ExpectMatchState) => any

type ExpectMatcherValue<MatchItem extends ExpectMatchFunction, Received = any, IsCallPromise extends boolean = false,> = MatchItem extends (received: Received, ...args: infer P) => Promise<any>
  ? (...args: P) => Promise<void>
  : ExpectMatchFunction extends (received: Received, ...args: infer P) => any
  ? IsCallPromise extends true
  ? (...args: P) => Promise<void>
  : (...args: P) => void
  : IsCallPromise extends true
  ? (...args: any) => Promise<void>
  : (...args: any) => void;

export type ExpectMatcher<MatchObject extends ExpectMatchObject, Received = any, IsCallPromise extends boolean = false> = {
  [Key in keyof MatchObject]: MatchObject[Key] extends (...args: infer A) => (state: ExpectMatchState) => Promise<ExpectMatchResult>
    ? ExpectMatcherValue<(...args: A) => Promise<ExpectMatchResult>, Received, IsCallPromise>
    : MatchObject[Key] extends (...args: infer A) => (state: ExpectMatchState) => ExpectMatchResult
    ? ExpectMatcherValue<(...args: A) => ExpectMatchResult, Received, IsCallPromise>
    : ExpectMatcherValue<MatchObject[Key], Received, IsCallPromise>;
}

type ExpectAssertion<Received, MatchObject, Type, DefaultObject, IsCallPromise extends boolean = false> =
  Received extends PromiseLike<infer Value>
  ? ({
    not: Omit<ExpectAssertion<Value, MatchObject, Type, DefaultObject, IsCallPromise>, 'not' | 'extend'>
    resolves: ExpectAssertion<Value, MatchObject, Type, DefaultObject, true>
    rejects: ExpectAssertion<Value, MatchObject, Type, DefaultObject, true>
  }) & (ConditionResult<Received, Type, MatchObject, DefaultObject> extends ExpectMatchObject
    ? ExpectMatcher<ConditionResult<Received, Type, MatchObject, DefaultObject>, Received, IsCallPromise>
    : ConditionResult<Received, Type, MatchObject, DefaultObject>)
  : ({
    not: Omit<ExpectAssertion<Received, MatchObject, Type, DefaultObject, IsCallPromise>, 'not' | 'extend'>
    resolves: ExpectAssertion<Received, MatchObject, Type, DefaultObject, true>
    rejects: ExpectAssertion<Received, MatchObject, Type, DefaultObject, true>
  }) & (ConditionResult<Received, Type, MatchObject, DefaultObject> extends ExpectMatchObject
    ? ExpectMatcher<ConditionResult<Received, Type, MatchObject, DefaultObject>, Received, IsCallPromise>
    : ConditionResult<Received, Type, MatchObject, DefaultObject>
  );

export type Expect<MatchObject extends ExpectMatchObject = {}, Type = any, DefaultObject = {}> = {
  <Received>(received: Received): ExpectAssertion<Received, MatchObject, Type, DefaultObject>;
  extend<ExtendMatchObject extends ExpectMatchObject, ExtendType = any>(object: ExtendMatchObject)
    : Expect<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>>;
}

import type { ConditionResult, ConditionType } from './utils'
import type { ExpellSpy } from '../spy';

export interface ExpellMatchState {
  not: boolean;
  resolves: boolean;
  rejects: boolean;
}

export type ExpellMatchResult = { pass: boolean | ((state: ExpellMatchState) => (boolean | Promise<boolean>)), message: (state: ExpellMatchState) => string };

export type ExpellMatchFunction = (...args: any) => ExpellMatchResult;

export type ExpellMatchPromiseFunction = (...args: any) => Promise<ExpellMatchResult>;

export type ExpellMatchObject = {
  [key: string]: ExpellMatchFunction | ExpellMatchPromiseFunction
}
// type ReceivedParameters<Received, Fun extends Function> =
//   Fun extends <R extends Received>(received: R, expected: R, ...args: infer P) => any
//     ? <R extends Received>(expected: R, ...args: P) => void
//     : Fun;

export type ExpellMatcher<MatchObject extends ExpellMatchObject, Received = any, IsCallPromise extends boolean = false> = {
  [Key in keyof MatchObject]: MatchObject[Key] extends (received: Received, ...args: infer P) => Promise<any>
    ? (...args: P) => Promise<void>
    : MatchObject[Key] extends (received: Received, ...args: infer P) => any
      ? IsCallPromise extends true
        ? (...args: P) => Promise<void>
        : (...args: P) => void
      : IsCallPromise extends true
          ? (...args: any) => Promise<void>
          : (...args: any) => void;
}

type ExpellAssertion<Received, MatchObject, Type, DefaultObject, IsCallPromise extends boolean = false> =
  Received extends PromiseLike<infer Value>
  ? ({
    not: Omit<ExpellAssertion<Value, MatchObject, Type, DefaultObject, IsCallPromise>, 'not' | 'extend'>
    resolves: ExpellAssertion<Value, MatchObject, Type, DefaultObject, true>
    rejects: ExpellAssertion<Value, MatchObject, Type, DefaultObject, true>
  }) & (ConditionResult<Received, Type, MatchObject, DefaultObject> extends ExpellMatchObject
      ? ExpellMatcher<ConditionResult<Received, Type, MatchObject, DefaultObject>, Received, IsCallPromise>
      : ConditionResult<Received, Type, MatchObject, DefaultObject>)
  : ({
    not: Omit<ExpellAssertion<Received, MatchObject, Type, DefaultObject, IsCallPromise>, 'not' | 'extend'>
  }) & (ConditionResult<Received, Type, MatchObject, DefaultObject> extends ExpellMatchObject
    ? ExpellMatcher<ConditionResult<Received, Type, MatchObject, DefaultObject>, Received, IsCallPromise>
    : ConditionResult<Received, Type, MatchObject, DefaultObject>
  );

export type Expell<MatchObject extends ExpellMatchObject = {}, Type = any, DefaultObject = {}> = {
  <Received>(received: Received): ExpellAssertion<Received, MatchObject, Type, DefaultObject>;
  extend<ExtendMatchObject extends ExpellMatchObject, ExtendType = any>(object: ExtendMatchObject)
    : Expell<ExtendMatchObject, ExtendType, ConditionType<Type, MatchObject, DefaultObject>>;
}

import { BaseExpect, Matchers as JMatcher, AsymmetricMatchers } from 'expect';
import { ToMatchSnapshotOptions } from '../core/snapshot';

type Matchers<R extends void | Promise<void>> = JMatcher<R> & SnapshotMatchers;

// from expect
type Inverse<MatchersT> = {
  not: MatchersT;
};

type PromiseMatchers = {
  rejects: Matchers<Promise<void>> & Inverse<Matchers<Promise<void>>>;
  resolves: Matchers<Promise<void>> & Inverse<Matchers<Promise<void>>>;
};


interface SnapshotMatchers {
  toMatchSnapshot(options: ToMatchSnapshotOptions): Promise<void>;
}


export type ExpectType = {
  <T = unknown>(actual: T): Matchers<void> &
    Inverse<Matchers<void>> &
    PromiseMatchers;
} & BaseExpect &
  AsymmetricMatchers &
  Inverse<Omit<AsymmetricMatchers, 'any' | 'anything'>>;

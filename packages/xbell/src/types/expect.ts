import { BaseExpect, Matchers as JMatcher, AsymmetricMatchers } from 'expect';
export interface ToMatchSnapshotOptions {
  /**
   * Image name
   */
  name: string;
  /**
   * 
   * The number of different pixels.
   * @default 0
   */
  maxDiffPixels?: number;
  /**
   * The ratio of different pixels, ranges from 0 to 1.
   * @default undefined
   */
  maxDiffPixelRatio?: number;
  /**
   * Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive.
   * @default 0.2
   */
  threshold?: number;
}

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

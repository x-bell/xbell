import type { FixtureFunction } from './types';

export function defineFixture<T>(fixtureFunc: FixtureFunction<T>): FixtureFunction<T> {
  return fixtureFunc
}

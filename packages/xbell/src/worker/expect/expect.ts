import { expect as basic } from '@xbell/assert';
import { e2eMatcher } from '../expect/matcher';
import { E2EMatcher, Expect } from '../../types';

export const expect: Expect = basic.extend<E2EMatcher>(e2eMatcher);

export type {
  Expect
};


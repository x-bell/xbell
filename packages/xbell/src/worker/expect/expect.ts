import { expect as basic } from '@xbell/assert';
import { elementMatcher } from '../expect/matcher';

export const expect = basic.extend(elementMatcher);

export type Expect = typeof expect;

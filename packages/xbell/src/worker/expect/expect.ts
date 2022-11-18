import { expect as basic } from '@xbell/assert';
import { e2eMatcher } from '../expect/matcher';

export const expect = basic.extend(e2eMatcher);

export type Expect = typeof expect;

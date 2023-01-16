import { createExpect, defineMatcher } from './expect';
import { anyMatcher } from './matchers/any';
import { numberMatcher } from './matchers/number';
import { spyMatcher } from './matchers/spy';
import { spy as fn } from './spy';
import { spyOn } from './spyOn';
import type { Mock } from './spy';
import type {
  ExpectMatchState,
  Expect,
  ExpectMatchFunction,
  ExpectMatchObject,
  ExpectMatchFunctionReturnPromiseFunction,
  ExpectMatchFunctionReturnFunction,
  ExpectMatchNormalFunction,
  ExpectMatchPromiseFunction,
  ExpectMatchResult
} from './types/expect';

import { getAssertionMessage } from './message';

export const expect =
  createExpect(anyMatcher)
    .extend(numberMatcher)
    .extend(spyMatcher);

export { defineMatcher, fn, spyOn, getAssertionMessage };

export type {
  Mock,
  ExpectMatchState,
  Expect,
  ExpectMatchFunction,
  ExpectMatchObject,
  ExpectMatchFunctionReturnFunction,
  ExpectMatchFunctionReturnPromiseFunction,
  ExpectMatchNormalFunction,
  ExpectMatchPromiseFunction,
  ExpectMatchResult,
};

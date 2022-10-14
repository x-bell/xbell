import { createExpell, defineMatcher } from './expell';
import { anyMatcher } from './matchers/any';
import { numberMatcher } from './matchers/number';
import { spyMatcher } from './matchers/spy';
import { spy as fn } from './spy';

export const expell =
  createExpell(anyMatcher)
  .extend(numberMatcher)
  .extend(spyMatcher);

export { defineMatcher, fn };

export default expell;





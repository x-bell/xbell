import { createExpell, defineMatcher } from './expell';
import { anyMatcher } from './matchers/any';
import { numberMatcher } from './matchers/number';

export const expell = createExpell(anyMatcher)
  .extend(numberMatcher);

export { defineMatcher };

export default expell;





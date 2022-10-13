import { expell } from 'expell';
import { elementMatcher } from '../expect/matcher';

export const expect = expell.extend(elementMatcher);

export type Expect = typeof expect;

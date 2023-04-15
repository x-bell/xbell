import { test } from 'xbell';

test.browser('browser debug', () => {
  const a = 1 + 1;
  debugger;
  console.log(a);
});
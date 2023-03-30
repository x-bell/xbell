import { test } from 'xbell';

test.browser('browser-console', async () => {
  const { invokeConsoleLog } = await import('./log');
  invokeConsoleLog();
  console.log('outter:console.log');
  console.time('outter:duration');
  console.timeEnd('outter:duration');
});

export function invokeConsoleLog() {
  console.log('inner:console.log');
  console.time('inner:duration');
  console.timeEnd('inner:duration');
}

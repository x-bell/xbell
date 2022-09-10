
import { xbell } from './core/xbell';

;(async () => {
  // console.log('start');
  await xbell.runTest()
  // console.log('done');
})();

// const enhanceBrowserTest = test.extendBrowser(() => {
//   return {
//     window,
//     key: 'value',
//   }
// });

// enhanceBrowserTest.describe('', () => {
//   enhanceBrowserTest('', ({ page }) => {
//     page.execute(({ window, key }) => {
      
//     });
//   })
// })

// enhanceBrowserTest('', ({ page }) => {
//   page.execute(({ window, key }) => {
    
//   });
// });

// const secondEnhanceBrowserTest = enhanceBrowserTest.extendBrowser(({ key }) => {
//   return {
//     key,
//     otherKey: 'bb',
//   }
// });

// secondEnhanceBrowserTest('', ({ page }) => {
//   page.execute(({ window, key, otherKey }) => {

//   });
// });


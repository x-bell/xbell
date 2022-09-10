import { test } from 'xbell';

const sleep = () => new Promise(resolve => setTimeout(resolve, 115000));


test('render vue app', async ({ page }) => {
  // await page.goto('https://www.baidu.com', {
  //   html: '<div id="app"></div>'
  // });
  // await page.evaluate(async () => {
  //   await import('./main');
  // });

  // await sleep();
})

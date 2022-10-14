import { test } from 'xbell';

const sleep = () => new Promise(resolve => setTimeout(resolve, 2000));


test('render App component', async ({ page }) => {
  // await page.goto('https://www.baidu.com', {
  //   html: '<div id="app"></div>'
  // });
  // console.log('App.test.ts文件 自己打印的...');
  // await page.evaluate(async () => {
  //   await import('./style.css');
  //   const { default: App } = await import('./App.vue');
  //   const { createApp } = await import('vue');
  //   createApp(App).mount('#app');
  // });
  // await sleep();
})

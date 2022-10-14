import { test, expect } from '..';
import { sleep } from '../utils';

// const sleep = () => new Promise(resolve => setTimeout(resolve, 5000));

test('index:1', () => {
  expect(1).toBe(2);
});

test('index:2', async ({
  page
}) => {
  console.log('index:2:inner');
  await page.goto('https://www.baidu.com');
  const btn = page.locateByText('新闻')
  await btn.click()
  await sleep(5000);
});

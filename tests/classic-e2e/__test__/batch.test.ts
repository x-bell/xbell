import { TestBatchArguments, Batch, Test } from 'xbell';

class BatchDemo {
  @Test()
  @Batch([
    1,
    2,
    3
  ])
  async each_example({ page, item, expect }: TestBatchArguments<number>) {
    await page.goto('https://example.com');
    await page.evaluate(({ item }) => {
      document.write('number is ' + item)
    }, {
      item
    });
    await expect(page).toMatchScreenshot({
      name: 'batch-screenshot-' + item,
    });
  }
}

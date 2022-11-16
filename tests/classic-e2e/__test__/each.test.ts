import { TestEachArguments, Each, Test, DisplayName } from 'xbell';

@DisplayName('custom-batch-demo')
class BatchDemo {
  @Test()
  @Each([1,2,3], (item) => `case: ${item}`)
  async each_example({ page, expect, item }: TestEachArguments<number>) {
    await page.goto('https://example.com');
    await page.evaluate(({ item }) => {
      document.write('number is ' + item)
    }, {
      item
    });
    // if (item === 1) {
    //   throw new Error('error')
    // }
    await expect(page).toMatchScreenshot({
      name: 'each-screenshot-' + item,
    });
  }
}

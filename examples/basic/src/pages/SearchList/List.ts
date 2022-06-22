import { Context, Inject } from 'xbell';

const ClassName = {
  Root: '.list-container',
  Item: '.MuiPaper-root',
};

export class List {
  @Inject()
  ctx: Context;

  async getCardList() {
    const itemClass = `${ClassName.Root} ${ClassName.Item}`;
    await this.ctx.page.waitForSelector(itemClass);
    const elements = await this.ctx.page.locator(itemClass).elementHandles();
    const promises = elements.map(async (ele) => {
      const name = await ele.innerText();
      return {
        name,
      };
    });
    return Promise.all(promises);
  }
}
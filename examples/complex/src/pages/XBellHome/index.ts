import { Context, Inject } from 'xbell';

export class XBellHomePage {
  @Inject()
  ctx: Context;

  async openPage() {
    await this.ctx.page.goto('https://x-bell.github.io/xbell/');
  }
}

import { Inject, Context, sleep } from 'xbell';

export class ParsingPage {
  @Inject()
  ctx: Context;

  async openPage() {
    await this.ctx.page.goto(this.ctx.envConfig.SITE_ORIGIN + '/material/intelligent-detail/image-parse/list');
  }


  // 创建图片解析任务
  async clickCreateTask() {
    await this.ctx.page.locator('text="+ 创建解析任务"').click();
  }

  async inputTaskName(taskName: string) {
    await this.ctx.page.locator('input[placeholder="请输入解析任务名称"]').fill(taskName + "-" + Date.now());
  }

  async clickChooseFolder() {
    await this.ctx.page.locator('text="选择文件夹"').click();
  }

  async clickSearchFolder() {
    await sleep(1000);
    await (await this.ctx.page.locator('.hlg-search__container .hlg-input__inner').elementHandles()).pop().focus();
  }

  async inputFolderName(folderName: string) {
    // 图片解析-搜索文件名，输入文件名
    await this.ctx.page.locator('textarea[class="hlg-textarea__inner"]').fill(folderName);
  }

  async pressEnter() {
    // 图片解析-搜索文件名，点击Enter触发搜索
    await this.ctx.page.locator('textarea[class="hlg-textarea__inner"]').press('Enter');
  }

  async chooseSpu() {
    await this.ctx.page.locator('text="全选"').click();
  }

  async clickComfirm() {
    await this.ctx.page.locator('text="确 定"').click();
  }

  async clickNextStep() {
    await this.ctx.page.locator('text="下一步，匹配商品素材"').click();
  }

  async clickStartParsing() {
    await this.ctx.page.locator('text="开始解析"').click();
  }

  // 搜索图片解析任务
  async clickSearchTask() {
    await this.ctx.page.locator('input[placeholder="请输入任务名称"]').click();
  }

  async inputSearchTaskName(taskName: string) {
    await this.ctx.page.locator('input[placeholder="请输入任务名称"]').fill(taskName);
  }

  async clickSearch() {
    await this.ctx.page.locator('text="查 询"').click();
  }

  async clickReset() {
    await this.ctx.page.locator('text="重 置"').click();
  }

  // 等待页面loading结束
  async waitForLoadingHidden() {
    await this.ctx.page.locator('.gda-spin-spinning').waitFor({
      state: 'hidden'
    });
  }

  // 进入图片解析任务
  async stepIntoTask() {
    await this.ctx.page.locator('text="进入任务"').click();
  }

  async chooseTag(type: string, tag: string, view: string) {
    await this.ctx.page.locator('input[placeholder="请选择"] + .gda-cascader-picker-label').click();
    await this.ctx.page.locator(`li[title="${type}"]`).click();    
    await this.ctx.page.locator( `li[title="${tag}"]`).click();
    await this.ctx.page.locator(`li[title="${view}"]`).click();
  }

  async clickSearchTaskDetail() {
    await this.ctx.page.locator('text="查询"').click();
  }

  async clickPic(picName: string) {
    await this.ctx.page.locator(`text="${picName}"`).click();
  }




}
import { Group, Data, Inject, Case, Context, Depend, Expect, sleep} from 'xbell';
import { Parsing, parsingTask } from '../data/parsing';
import { adminAccount } from '../data/account';
import { ParsingPage } from '../pages/Parsing';
import { LoginTestGroup } from './login.test';
import path = require('path');


@Group('图片解析测试')
export class ParsingTestGroup {
  @Inject()
  ctx: Context;

  // 注入页面对象
  @Inject()
  parsingPage: ParsingPage;


  @Case('qyds创建图片解析任务')
  @Depend(LoginTestGroup, 'testAdminLoginSuccess', adminAccount)
  @Data(parsingTask) 
  async testCreateParsingTaskSuccess(@Data.Param() parsing: Parsing) {
    await this.parsingPage.openPage();
    await this.parsingPage.clickCreateTask();  
    await this.parsingPage.inputTaskName("自动创建任务" + parsing.spuId);
    await this.parsingPage.clickChooseFolder();
    await this.parsingPage.clickSearchFolder ();
    await this.parsingPage.inputFolderName(parsing.spuId);
    await this.parsingPage.pressEnter();
    await this.parsingPage.chooseSpu();
    await this.parsingPage.clickComfirm();
    await this.parsingPage.clickNextStep();
    await this.parsingPage.clickStartParsing();
  }

  
  @Case('搜索/重置图片解析任务')
  @Depend(LoginTestGroup, 'testAdminLoginSuccess', adminAccount)
  @Data(parsingTask) 
  async testSearchParsingTaskSuccess(@Data.Param() parsing: Parsing) {
    await this.parsingPage.openPage();
    await this.parsingPage.clickSearchTask();
    await this.parsingPage.inputSearchTaskName(parsing.taskName);
    await this.parsingPage.clickSearch();

    /** 
     * TODO: 此处需要断言，待凉寒实现：
     * this.ctx.expect(this.ctx.page).snapshotMatch('模板1搜索结果')
     * 会在生成 __snapshots__/<groupName>/<caseName>/模板1搜索结果.png
    */

    await this.parsingPage.waitForLoadingHidden();
    await this.parsingPage.clickReset();    
  }

  @Case('图片解析任务内修改查询')
  @Depend(LoginTestGroup, 'testAdminLoginSuccess', adminAccount)
  @Data(parsingTask) 
  async testParsingTaskDetail(@Data.Param() parsing: Parsing) {
    await this.parsingPage.openPage();
    await this.parsingPage.clickSearchTask();
    await this.parsingPage.inputSearchTaskName(parsing.taskName);
    await this.parsingPage.clickSearch();
    await this.parsingPage.waitForLoadingHidden();
    await this.parsingPage.stepIntoTask();
    await this.parsingPage.chooseTag(parsing.type, parsing.tag, parsing.view);
    await this.parsingPage.clickSearchTaskDetail();
    await this.parsingPage.waitForLoadingHidden();
    await this.parsingPage.clickPic(parsing.picName);

    /**
     * TODO: 依赖开发增加字段data-testid，做选中和修改后的字段断言
     */
  }

  @Case('download')
  // @Depend(LoginTestGroup, 'testAdminLoginSuccess', adminAccount)
  async testA() {
    // await this.ctx.page.goto('https://qyds-fat.gaoding.com/material/intelligent-detail/list/1419?name=%E6%99%BA%E8%83%BD%E8%AF%A6%E6%83%85-%E4%B8%8A%E6%96%B0%E6%97%B6%E5%B0%9A%E5%95%86%E5%8A%A1%E9%80%9A%E5%8B%A4%E5%A5%B3%E8%A3%85%E5%A4%96%E5%A5%97%E9%A9%AC%E7%94%B2%E8%AF%A6%E6%83%85%E9%A1%B5');
    // await this.ctx.page.queryByText('下 载').click();
    const [
      download
    ] = await Promise.all([
      this.ctx.page.waitForEvent('download', { timeout: 1000 * 60 * 5 }),
      this.ctx.page.goto('https://codeload.github.com/creativetimofficial/notus-react/zip/refs/heads/main')
      // this.ctx.page.queryByClass('smart-design-download__download-btn').click(),
    ])
    await download.saveAs(path.join(__dirname))
    // const path = await download.path()
    await sleep(5000);
  }
}
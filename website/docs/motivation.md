---
sidebar_position: 1
---

# 项目初衷

** 希望通过模式化去规范测试代码，降低用例代码的维护成本。**

## 断言清晰

先来看一段简单的测试, 以成熟的 `selenium` 来举例
```typescript
describe('测试百度', () => {
  it ('打开百度，搜索稿定', (page) => {
    driver = webdriver.Chrome(executable_path='/Users/dirvers/chromedriver')
    driver.get('https://www.baidu.com')
    driver.find_element_by_id('kw').send_keys('稿定科技')
    driver.find_element_by_id('su').click()
  })
})
```

这是一个打开百度进行搜索的用例，只要每个步骤没有抛错，则认为测试通过。
假如用例再严格一点，要求页面控制台也必须无报错，除了要写上面的代码之外，还需要额外监听一些事件

`cypress`
```javascript
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error');
});

afterEach(() => {
  cy.window().then((win) => {
    expect(win.console.error).to.have.callCount(0);
  });
});
```
`palywright`
```typescript
const errorLogs = []
page.on("console", (message) => {
  if (message.type() === "error") {
    errorLogs.push(message.text())
  }
})
expect(errorLogs.length).toBe(0);
```
虽然 cypress、playwright、senlenium，它们都能做到。
但仍然还是很繁琐，因为这样的代码维护起来，难度很高：代码难懂，且断言不直观
尝试幻想了一下自己脑子里自动化测试代码，它应该满足： **断言简单，且一目了然**

**所以它应该长这样：**
```javascript
@Expect.Console.NoError() // 断言控制台 error 打印
it ('打开百度，搜索稿定', () => {
  // code...
})
```

不过 `js` 并不支持这种语法，也没必要再搞个 `GaoDingScript` 。同时受 `pytest` 和 `java` 这些基于 `class` 的测试写法，我认为可以基于 TS 写成这样：
```typescript
@Group('测试百度')
class TestBaiduGroup {
  
  @Case('打开百度，搜索稿定')
  @Expect.Console.NoError()
  async searchGaoding() {
    // code...
  }
}
```

同时这种写法还有一个好处，它天然的能支持用例的代码复用，例如：
```typescript
@Group('测试百度')
class TestBaiduGroup {
  @Case('打开百度，搜索稿定')
  @Expect.Console.NoError()
  async searchGaoding() {
    // code...
  }

  @Case('点击第一个，跳转稿定')
  @Expect.Url.Includes('gaoding.com')
  openLink() {
    // 复用搜索case的逻辑
    await this.searchGaoding()
    const firstElem = page.findElement('[class=item]')
    await firstElem.click()
  })
}
```
**这是我想改变的第一个点：断言清晰。**
##  POM & 模块化思想
接着，再看测试领域相对成熟的实践： POM（Page Object Model）

POM 并不是什么高大上的东西，就像 MVC 一样，是一种代码分层的手段：把「页面功能」封装在一个「页面类」里，这个「页面类」只提供用户视角的API，用例代码直接调用该类的实例方法即可完成代码的编写。
```typescript
// 将「用户视角接口」封装在「页面类」中
class BaiduHomePage {
  inputKeywords(keywords: string) {
    // code...
  }
  
  clickSearch() {
    // code...
  }
}

it ('打开百度，搜索稿定', () => {
  const baiduHomePage = new BaiduHomePage()
  baiduHomePage.inputKeywords('稿定科技')
  baiduHomePage.clickSearch()
})
```

POM 可以提高代码的可维护性。它把例如「选择器」的一些脏逻辑封装在 Page Object 里，这样能让**用例层的代码**显得非常**清晰**、**有条理**。同时它也提供了更多的可能：例如生成带有步骤描述的测试报告（这里不展开）。

但深入细节后，我发现 POM 也有一个小缺点，就是每个 Page 实例化时，都需要传入浏览器的上下文
拿 `playwright` 举例，将 playwright 相关的上下文传入到 Page Object 里：
```typescript
test('打开百度，搜索稿定', ({ page }) => {
  const baiduHomePage = new BaiduHomePage(page)
  baiduHomePage.inputKeywords('稿定科技')
  baiduHomePage.clickSearch()
})
```

虽然看着没多大差别，但其实已经打开了潘多拉魔盒。因为入参是由开发这个 Page Object 的开发者决定的，不同的开发者或功能不同的页面，它们的入参很可能不一样。虽然我们可以口头约定，要求入参统一，但还是不能完全杜绝入参不同的情况。
```javascript
// A 类只需要一个 page
const baiduHomePage = new BaiduHomePage(page)
// B 类还需要一个 环境参数
const gaodingHomePage = new GaodingHomePage({
  browserPage: page,
  env: 'fat'
})
```

这样，使得每个 Page Object 的使用，加入了一些成本，比如你要去关心它是否和环境有关等等，它的入参组成等等。
受 Angular 和 MidwayJS 这种基于TS的 IoC & DI 的灵感，我认为其实可以写成这样：
```typescript
class TestGroup {
  // 直接注入进来，无需关注 BaiduHomePage 的实例化
  @Inject()
  baiduHomePage: BaiduHomePage;

  @Case('打开百度，搜索稿定')
  searchGaoding() {
    this.baiduHomePage.inputKeywords('稿定科技')
    this.baiduHomePage.clickSearch()
  }
}
```

那 BaiduHomePage 的浏览器上下文怎么拿到？可以也通过 `Inject()`
```typescript
import { Inject, Context } from 'framwork';
class BaiduHomePage {
  @Inject()
  ctx: Context;

  async inputKeywords(keywords: string) {
    const keyworkInput = await this.ctx.page.findElement('.keywork-input');
    await keyworkInput.input('稿定科技');
  }
}
```
这样，一个测试框架雏形就出来了。

上面的思想，它甚至天然地具备模块化的 POM 开发，以**「智能详情」**的列表页面为例。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/216490/1654055899558-17d98c90-3ed0-4de5-8656-b195463919cd.png#clientId=u6376d473-9bfa-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1018&id=uff8c300c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1018&originWidth=1521&originalType=binary&ratio=1&rotation=0&showTitle=false&size=986545&status=done&style=none&taskId=u25071db2-d937-4934-9fb1-ce941786e9f&title=&width=1521)
这个页面的用户交互不少，如果你要基于一个 Class 提供全部这些方法，想必这个 Class 代码会很多。而有些「区域」是多个 Page Object 通用的，你也没法很好的共享
如果按照「用户视角」去做区域分层，其实可以区分出 Header、Nav、TabBar、SearchBar、List 等模块的，所以 POM 其实也提倡 `pageA.componentB.xxx()`这样的形式。那么通过依赖注入，就可以写成这样

```typescript
import { Inject } from 'framwork'

import Nav from 'common/Nav';
import Header from 'common/Header'
import List from './List'
import TabBar from './TabBar'
import SearchBar from './SerachBar'

class SmartDetailListPage {
  @Inject()
  nav: Nav;

  @Inject()
  header: Header;

  @Inject()
  list: List;

  @Inject()
  tabBar: TabBar;

  @Inject()
  searchBar: SearchBar;
}
```
在每个组件内部，也不需要感知初始化入参，自身高内聚
```typescript
class SearchBar {
  ctx: Context;
  
  async inputKeywords() {
    // this.ctx.page.xxx()
  }
}
```
就像 React、Vue、Svelte 一样，Page Object 也可以通过组件化的思想去开发，只是从 jsx 变成了 Property + Inject。
## 数据驱动测试 - DDT
开发领域有「测试驱动开发」，那在测试领域，又由什么来驱动更合适？显然是数据，一个 QA 的痛处，想必就是“我TM要在各个环境都点一遍”。但之所以要在“各环境都点一遍”，除了保证功能在各环境一样，还有一最重要的点是各环境“数据不一样”，不同的数据很有可能造成不同的测试结果。
基于上面，通过 Class + 装饰器的模式，能非常好的做到 批量 + 参数化测试。
拿登录举例，用例应该只需写一次，且无需关注不同环境的数据区分，就能直接写用例代码
```typescript
export const successAccounts: MultiEnvData<Account[]> = {
  fat: [
    {
      descriptioin: '普通用户',
      username: 'fat_17600600258',
      password: 'gaoding123',
      company: 'A公司'
    },
    {
      descriptioin: '会员用户',
      username: 'fat_18888888888',
      password: '8888888',
      company: '牛逼科技'
    }
  ],
  prod: [
    {
      descriptioin: '普通用户',
      username: '17600600258',
      password: 'gaoding123',
      company: 'A公司'
    },
    {
      descriptioin: '会员用户',
      username: '18888888888',
      password: '8888888',
      company: '牛逼科技'
    }
  ]
};

@Group('登录页')
export class LoginTestGroup {
  @Inject()
  protected loginPage: LoginPage;

  @Inject()
  protected ctx: Context;

  @BeforeEachCase()
  protected async before() {
    await this.loginPage.navigate();
  }

  @Case('登录成功')
  @BatchData(successAccounts) // 声明数据的导入，不同环境会注入不同的数据
  // 通过参数装饰器 @BatchData.Param() 拿到注入的数据
  public async loginSuccess(@BatchData.Param() account: Account) {
    await this.loginPage.inputUsername(account.username);
    await this.loginPage.inputPassword(account.password);
    await this.loginPage.clickSumbit();
    await this.loginPage.selectCompany(account.company);
    await this.loginPage.waitForHomepage();
  }
}
```
# 稿定迭代流程
回到稿定自身的迭代流程，假如我是一个 QA，我会想要某些新功能的 case 仅在fat环境运行。有些 fat 上的功能有bug，就暂时不运行，但在测试报告中要能体现。
所以，能否这样？
```typescript
@Group('xxx')
export class TestGroupB {

  @Inject()
  protected ctx: Context;
  
  @Case('新功能A')
  @RunEnvs(['fat']) // 功能未上线，只在 fat 上跑
  caseA() {
  }
  
  @Bug('凉寒说6.2之前修复')
  @Case('新功能B')
  @RunEnvs(['fat']) // 功能未上线，只在 fat 上跑
  caseB() {
  }
 
  @Case('老功能C')
  caseC() {
    
  }
}
```

### 测试与开发协作

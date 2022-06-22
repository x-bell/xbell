---
sidebar_position: 4
---

# POM & 模块化

XBell 天然具备 POM & 模块化的能力。

## 什么是 POM

全称 Page Object Model。

简单理解，POM 就像 MVC 一样，是一种易于抽象的代码分层方式。

先来看一个用例：这个用例很简单，打开百度，然后搜索 XBell
```typescript
async testCase() {
  await this.ctx.page.goto('https://www.baidu.com/');
  await this.ctx.page.locator('#kw').fill('XBell');
  await this.ctx.page.locator('#su').click();
}
```

上面的用例代码直接使用了「查询器」这种和页面强相关的逻辑。

这会导致一个问题，当百度页面的组件换了其它的 id，那么相关的用例代码都要改一遍，这也是通常自动化测试代码难以维护的原因之一。

## 如何使用 POM
上面的问题可以通过 POM 解决：先抽象一个 Page Object，这个 Page Object 包含了页面强相关的逻辑，并且它只提供「用户视角」的 API。

**强调一下，是用户视角的 API， 不是开发视角的 API**

开发视角 API：pageObject.getKeywordInputDom().value = 'XBell'

用户视角 API：pageObject.inputKeywords('XBell')

为什么是用户视角？因为端到端测试不是单元测试，它是一种白盒测试：我不知道产品的技术实现，我仅站在用户的角度，产品应该提供哪些功能？

所以在用例代码中，是尽量不感知技术实现的，所有的技术细节应该在 PageObject 中包掉。最终你的用例代码，就像「行为驱动测试」一样：简洁有力。

讲了这么多，那在 XBell 中，如何写 POM 代码？
```typescript title="src/pages/Baidu.ts"
import { Context, Inject } from 'xbell';

export class BaiduPage {
  @Inject()
  ctx: Context;

  async openPage() {
    await this.ctx.page.goto('https://www.baidu.com/');
  }

  async inputKeywords(keywords: string) {
    await this.ctx.page.locator('#kw').fill(keywords);
  }

  async clickSearch() {
    await this.ctx.page.locator('#su').click();
  }
}
```

```typescript title="src/cases/search.test.ts"
import { Group, Case, Inject } from 'xbell';
import { BaiduPage } from '../pages/Baidu';

@Group('搜索测试分组')
class SearchTestGroup {
  @Inject()
  baiduPage: BaiduPage;

  @Case('百度搜索XBell')
  async testCase() {
    const { baiduPage } = this;
    await baiduPage.openPage();
    await baiduPage.inputKeywords('XBell');
    await baiduPage.clickSearch();
  }
}
```

通过单独声明一个**页面Class**，接着通过 `Inject()` 注入到 Group 中即可在用例中使用。


## 模块化
todo...

## 其它一些想法...(待讨论)

如果我们是一个英文母语的人，其实上面的用例已经很清晰了，它的测试报告就是：

1. baiduPage.openPage
2. baiduPage.inputKeywords: 'XBell'
3. baiduPage.clickSearch

但可能对非英文母语的朋友不太友好，还是不够一目了然（至少我自己是吧）。并且我希望这种测试报告是可以进行协同的，例如：我是一个测试同学，但我对产品逻辑还不太熟，我想将这份测试报告发给产品经理帮看看，是不是逻辑上有什么漏洞。如果是这样，我会希望中文的报告会更容易协同（至少在中国是的吧）。所以我想加入 Describe 装饰器：

```typescript
@Describe('打开百度页面')
async openPage() {
  await this.ctx.page.goto('https://www.baidu.com/');
}
```
---
sidebar_position: 2
---

# 快速开始

**通过5分钟体验一个 `XBell` 自动化项目。**

## 创建一个 xbell 项目
```bash
# 初始化一个项目
$ npm create xbell
# 进入项目
$ cd <your-project-name>
# 安装浏览器（需要等待些时间）
$ npm run install:browser
# 运行用例
$ npm run start
```

## 目录

```text
├── src
│   ├── cases                    # 用例目录
│   │   └── search-list.test.ts
│   ├── components               # 通用组件目录
│   │   └── CommonHeader.ts
│   ├── data                     # 数据存放目录
│   │   └── contact.ts
│   └── pages                    # 页面目录
│       └── SearchList
│           ├── List.ts          # 页面私有组件，可直接放页面目录中
│           ├── SearchBar.ts
│           └── index.ts
├── environment.d.ts             # 声明环境变量
└── xbell.config.ts              # 配置 xbell & 环境变量
```

## 写下第一个 case
不同于传统的 `describe` + `it` 的写法，**XBell** 只允许 `Class` + `Method` 的写法，因为 XBell 相信这更容易写出易维护的用例代码。

```typescript title="src/cases/hello.test.ts"
import { Group, Case } from 'xbell';

@Group('第一个测试分组')
export class HelloTestGroup {

  @Case('什么都不干')
  testHelloXBell() {
    console.log('Hello XBell');
  }
}
```

**XBell**是一个基于装饰器的测试框架，当你把一个 `Class` 打上 `@Group()`，方法打上 `@Case()`，**XBell** 就会知道它是一个测试用例。


但上面的用例显然不能满足你日常的测试需求，日常的测试需求更可能是：“打开一个页面，页面 js 无报错，emmm...，再顺便截一张图看看 UI 有没乱吧”。

在 **XBell** 中，也许通过两个「断言装饰器」能满足你的需求。相比在用例代码中夹杂着断言语句，「断言装饰器」的好处是：更一目了然。
```typescript title="src/cases/hello.test.ts"
import { Group, Case, Expect, Inject, Context } from 'xbell';

@Group('第一个测试分组')
export class HelloTestGroup {
  @Inject()
  ctx: Context;

  @Case('打开 XBell 官网，页面无报错并截图')
  // 添加两个断言
  @Expect.NoPageError()
  @Expect.ToMatchSnapshot({ name: '截图' })
  async testHelloXBell() {
    await this.ctx.page.goto('https://x-bell.github.io/xbell/');
  }
}

```

你可能已经注意到上面代码中的 `Context`  和 `Inject()`，**XBell** 基于 TS + IoC 的模式，依赖可以通过 `Inject()` 去注入。下面是一个 `POM` 的用法，更多请参考 [POM & 模块化](./pom.md)

```typescript
// Page Object
class XBellPage {
  @Inject()
  ctx: Context;

  async openPage() {
    await this.ctx.page.goto('https://x-bell.github.io/xbell');
  }
}

@Group('测试分组')
class TestGroup {
  @Inject()
  xbellPage: XBellPage;


  @Case('打开 XBell 官网，无报错')
  @Expect.NoPageError()
  async openXBellPage() {
    await this.xbellPage.openPage();
  }
}
```
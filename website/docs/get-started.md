---
sidebar_position: 1
---

# 快速开始

**通过5分钟体验一个 `xbell` 自动化项目。**

## 创建一个 xbell 项目
```bash
npm create xbell
```

## 目录

```bash

```

## 写下第一个 case
```typescript
import { Group, Case, Inject, Context } from 'xbell';

@Group('测试组')
export class TestGroup {
  @Inject()
  ctx: Context;

  @Case('打开 XBell 文档')
  async openWindBellDocsWithoutError() {
    await this.ctx.page.goTo('https://www.github.com/x-bell/xbell');
  }
}
```

## 运行用例
```bash
npm run start
```

## 装饰器断言
```typescript
import { Group, Case, Inject, Context, Expect } from 'xbell';

@Group('测试组')
export class TestGroup {
  @Inject()
  ctx: Context;

  @Case('打开xbell文档，控制台无报错')
  @Expect.Console.NoError() // 通过装饰器断言
  async openWindBellDocsWithoutError() {
    await this.ctx.page.goTo('https://www.github.com/x-bell/xbell');
  }
}
```


## POM 模式
```typescript
import { Group, Case, Expect, Context, Inject } from 'xbell';


```
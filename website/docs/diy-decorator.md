---
sidebar_position: 5
---
# 定义装饰器

利用装饰器，可以快速提高你的开发自动化的效率。

## 简单装饰器
```typescript
import { defineDecorator } from 'xbell';

const SimpleDecorator = defineDecorator({
  before() {
    console.log('SimpleDecorator::before');
  },
  after() {
    console.log('SimpleDecorator::after');
  }
})

@Group('demo group')
class TestGroup {
  @Case('demo')
  @SimpleDecorator()
  async testCase() {

  }
}
```

## 通过 API 快速登录

```typescript title="src/decorators/api-login.ts"
import { defineDecorator } from 'xbell';

export const ApiLogin = defineDecorator({
  async before(ctx) {
    await ctx.page.goto('https://example.com');
    await ctx.page.evaluate(() => {
      // fetch api，参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
      window.fetch('https://example.com/api/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: 'xx',
          password: 'xx',
        })
      })
      .then(res => res.json())
      .then((data) => {
        // 如果接口直接种 set-cookie 则不需处理
        window.localStorage.setItem('token', JSON.stringify(data.xx))
      })
    })
  },
})
```

**使用自定义装饰器**

```typescript title="src/cases/account.test.ts"
@Case('测试账户页面')
@ApiLogin()
async testAccountPage() {
  this.ctx.page.goto('https://example.com/account');
  // ...
}
```
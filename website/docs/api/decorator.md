---
sidebar_label: 用例
---

# 用例装饰器

## Group
**声明测试分组**

```typescript title="src/cases/demo.test.ts"
import { Group } from 'xbell';

// 声明一个测试分组，并导出
@Group('demo分组')
export class TestGroup() {

}
```

**参数**
- groupName: string (分组的名称，会在测试报告中体现)

function

## Case
**声明测试用例**
```typescript title="src/cases/demo.test.ts"
import { Group, Case } from 'xbell';

@Group('demo分组')
export class TestGroup() {
  // 声明一个测试用例
  @Case('demo用例')
  async testCase() {
    // ...
  }
}
```

**参数**
- caseName: string (用例的名称，会在测试报告中体现)

## RunEnvs
**指定用例运行的环境**

当你的产品或新功能处于未上线阶段，你可以通过 `RunEnvs` 指定仅在非线上环境运行。或者当你的某个用例没有准备开发环境的数据，你仅仅想测线上环境，也可以使用该装饰器。
```typescript title="src/cases/demo.test.ts"
@Case('demo用例')
@RunEnvs(['dev']) // 该用例仅在开发环境运行
async testCase() {
  // ...
}
```

**参数**
- envs: string[] (环境列表)

## Viewport
**指定用例运行时的窗口大小**
```typescript title="src/cases/demo.test.ts"
@Case('demo用例')
@Viewport({ width: 1280, height: 800 })
async testCase() {
  // ...
}
```

**参数**
- size
  - width: number （宽度）
  - height: number (高度)



---
sidebar_label: 断言
---

# 断言装饰器

## Expect.NoPageError
**断言页面无报错**

```typescript
import { Expect } from 'xbell';
@Case('demo用例')
@Expect.NoPageError()
async testCase() {
   // ...
}
```

## Expect.ToMatchSnapshot
**页面截图并对比**

初次运行只会进行截图存在 `__snapshots__/<groupName>/<caseName>/` 目录下，这时候需要人工去确认截图是否无误。从第二次开始，将会对`__snapshots__`已有的截图去进行对比。

```typescript
@Case('demo用例')
@Expect.ToMatchSnapshot({ name: '屏幕截图' })
async testCase() {
   // ...
}
```

**参数**
- snapshotOptions
  - name: sring（快照名称)
  - maxDiffPixels: number(允许 diff 的像素值，默认为 0)
  - maxDiffPixelRatio: number(允许 diff 的像素比例：0~1，若已经设置了 maxDiffPixels，则不生效)
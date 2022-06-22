---
sidebar_label: 断言
---

# 断言装饰器

## NoPageError
**断言页面无报错**

```typescript
@Case('demo用例')
@Expect.NoPageError()
async testCase() {
   // ...
}
```

## SnapshotMatch
**页面截图并对比**

初次运行只会进行截图存在 `__snapshots__/<groupName>/<caseName>/` 目录下，这时候需要人工去确认截图是否无误。从第二次开始，将会对`__snapshots__`已有的截图去进行对比。

```typescript
@Case('demo用例')
@Expect.SnapshotMatch()
async testCase() {
   // ...
}
```

**参数**
- snapshotOptions
  - imageName: sring（快照名称，默认为 `default.png`；注意：你也可以在用例代码中写很多 expect(ctx.page).snapshotMatch()，所以一个用例下可以有多张截图)
  - diffPXCount: number(允许 diff 的像素值，默认为 0)
  - diffPXRatio: number(允许 diff 的像素比例，默认为 0，若已经设置了 diffPXCount，则不生效)
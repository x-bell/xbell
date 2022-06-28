# 快照测试

快照测试的玩法是：在用例代码中加入「快照断言」，在第一次运行用例时会生成「快照图片」，并保存在`__snapshots__/<group-name><case-name>/`中。

此时需要人工去观察图片是否满足样式要求。如若满足，则将`__snapshots__` 随项目一起提交到代码仓库中。

在下一次运行用例代码时，「快照断言」将会对已有 `__snapshots__` 下的图片进行像素级对比。如果对比不同，用例将会失败，会生成`xx.new.png` 和 `xx.diff.png`。

此时就可以通过 `xx.new.png` 和  `xx.diff.png` 查看不同。

如果是因为发生了「正常更新」导致的样式不一致，可以通过 `xbell update snapshot` 更新(未支持)。

```typescript
async testCase() {
  const { page, expect } = ctx;
  await page.goto('https://x-bell.github.io/xbell/');
  await expect(page).toMatchSnapshot({ name: 'X-Bell官网截图', maxDiffPixelRatio: 0.95 });
}
```


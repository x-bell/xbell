---
sidebar_label: 查询
---

# 查询

## ctx.page.queryByText

**根据文本内容查询**

```typescript
await ctx.page.queryByText('xxx').click();
```

## ctx.page.queryByTestId

**根据属性data-testid查询**

```typescript
await ctx.page.queryByTestId('xxx').click();
```

## ctx.page.queryByClass

**根据class查询**

```typescript
await ctx.page.queryByClass('xxx').click();
```

## ctx.page.queryById

**根据id查询**

```typescript
await ctx.page.queryByClass('xxx').click();
```
---
sidebar_label: 查询
---

# 查询

## ctx.page.getElementByText

**根据文本内容查询**

```typescript
await ctx.page.getElementByText('xxx').click();
```

## ctx.page.getElementByTestId

**根据属性data-testid查询**

```typescript
await ctx.page.getElementByTestId('xxx').click();
```

## ctx.page.getElementByClass

**根据class查询**

```typescript
await ctx.page.getElementByClass('xxx').click();
```

## ctx.page.queryById

**根据id查询**

```typescript
await ctx.page.getElementByClass('xxx').click();
```
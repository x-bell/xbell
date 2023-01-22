<div align="center">
  <img
    height="138"
    width="138"
    alt="xbell"
    src="https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-full.svg"
  />
<h1>XBell</h1>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/x-bell/xbell/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/xbell.svg?color=73a5e9)](https://www.npmjs.com/package/xbell)
![resolution](https://isitmaintained.com/badge/resolution/x-bell/xbell.svg?style=for-the-badge)
</div>

## Unit Testing
### test in nodejs
```typescript
import { test } from 'xbell';

test('test code in nodejs', ({ add, expect }) => {
  const { add } = await import('./add');
  const result = add(1, 1);
  expect(result).toBe(2);
});
```

### test in browser
```typescript
test('test code in browser', ({ add, expect }) => {
  const { add } = await import('./add');
  const result = add(1, 1);
  expect(result).toBe(2);

  window.document.body.innerHTML = result;
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot',
  });
});
```

## E2E Testing
```typescript
test('e2e testing', ({ page, expect }) => {
  await page.goto('https://example.com');
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot',
  });
});
```

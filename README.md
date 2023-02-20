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

<p align="center">
  A powerful test framework.
</p>

<p align="center">
  <a href="https://x-bell.github.io/xbell">Documentation</a> |
  <a href="https://x-bell.github.io/xbell/docs/get-started">Getting Started</a>
</p>

## Installation
```bash
npm install xbell
```

To install the browser module, run the following command:
```bash
npx xbell install browser
```


## Unit Testing
### Testing in Node.js

Here's an example of how to use XBell to test your code in Node.js:
```typescript
import { test } from 'xbell';

test('test code in nodejs', ({ expect }) => {
  const { add } = await import('./add');
  const result = add(1, 1);
  expect(result).toBe(2);
});
```

### Testing in the Browser
Here's an example of how to use XBell to test your code in the browser:

```typescript
test('test code in browser', ({ expect, page }) => {
  const { add } = await import('./add');
  const result = add(1, 1);
  expect(result).toBe(2);

  window.document.body.innerHTML = result;
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot',
  });
});
```

## End-to-End Testing
Here's an example of how to use XBell to perform end-to-end testing:

```typescript
test('e2e testing', ({ page, expect }) => {
  await page.goto('https://example.com');
  await expect(page).toMatchScreenshot({
    name: 'default-screenshot',
  });
});
```

## License

XBell is [MIT licensed](./LICENSE).

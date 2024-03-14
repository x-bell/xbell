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
  A modern web testing framework that seamlessly combines unit testing, component testing, and end-to-end testing.
</p>

<p align="center">
  <a href="https://x-bell.github.io/xbell">Documentation</a> |
  <a href="https://x-bell.github.io/xbell/docs/get-started">Getting Started</a>
</p>

## Features

- **Unified Testing API** - One framework for unit, component, and E2E testing
- **Multi-Environment Support** - Freely switch between Node.js and Browser environments in a single test
- **Component Testing** - First-class support for React, Vue, and more
- **Visual Testing** - Built-in screenshot comparison and snapshot testing
- **TypeScript First** - Full TypeScript support out of the box
- **Fast & Modern** - Built with performance and developer experience in mind

## Installation

```bash
# npm
npm install xbell

# yarn
yarn add xbell

# pnpm
pnpm add xbell
```

To enable browser testing, install the browser module:

```bash
npx xbell install browser
```

## Quick Start

### Unit Testing in Node.js

```typescript
import { test, expect } from 'xbell';
import { add } from './add';

test('test code in nodejs', () => {
  const result = add(1, 1);
  expect(result).toBe(2);
});
```

### Unit Testing in Browser

```typescript
import { test } from 'xbell';

test.browser('test code in browser', async ({ expect }) => {
  const { add } = await import('./add');
  const result = add(1, 1);
  expect(result).toBe(2);
});
```

### End-to-End Testing

```typescript
import { test } from 'xbell';

test('e2e testing', async ({ page, expect }) => {
  await page.goto('https://example.com');
  await expect(page).toMatchScreenshot({
    name: 'homepage',
  });
});
```

### Mixed Environment Testing

Run code in both Node.js and Browser within a single test:

```typescript
import { test, expect } from 'xbell';

test('mixed environment testing', async ({ page }) => {
  // Execute code in browser
  await page.evaluate(async () => {
    const { add } = await import('./add');
    document.body.innerHTML = `<div>Result: ${add(1, 1)}</div>`;
  });

  // Assert in Node.js
  await expect(page).toMatchScreenshot({
    name: 'result',
  });
});
```

## Documentation

Visit [https://x-bell.github.io/xbell](https://x-bell.github.io/xbell) for full documentation.

## License

XBell is [MIT licensed](./LICENSE).

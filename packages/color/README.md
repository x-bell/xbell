# @xbell/color


## Installation
```bash
$ npm install @xbell/color
```

## Usage
```typescript
import color from '@xbell/color';

// Chain usage
console.log(
  color.bold.italic.red('hello')
);

console.log(
  color.bold.italic.bgRed('hello')
);

// custom color
console.log(
  color.rgb(255, 0, 0)('hello')
);
console.log(
  color.hex('#FF0000')('hello')
);

// gradient color
console.log(
  color.bold.gradient('#FF0000', '#00FF00')('hello')
);
console.log(
  color.bold.gradient([255, 0, 0], [0, 255, 0])('hello')
);

// radinbow color(internal gradient)
console.log(
  color.bold.rainbow('hello')
);
```

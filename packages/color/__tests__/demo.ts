import color from '../src/index';


console.log(color.hex('#FF0000')("hello") === '\x1b[38;2;255;0;0mhello\x1b[39m')
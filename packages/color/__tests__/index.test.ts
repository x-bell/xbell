import { test } from 'node:test';
import * as assert from 'assert';
import color from '../src/index';
import { AnsiColors } from './fixture';


test('support automatic casting to string', () => {
	assert.equal(color.bold(['foo', 'bar']), '\x1b[1mfoo,bar\x1b[22m');
	assert.equal(color.green(98_765), '\x1b[32m98765\x1b[39m');
});

test('style string', () => {
	assert.equal(color.underline('foo'), '\x1b[4mfoo\x1b[24m');
	assert.equal(color.red('foo'), '\x1b[31mfoo\x1b[39m');
	assert.equal(color.bgRed('foo'), '\x1b[41mfoo\x1b[49m');
});

test('support applying multiple styles at once', () => {
	assert.equal(color.red.bgGreen.underline('foo'), '\x1b[31m\x1b[42m\x1b[4mfoo\x1b[24m\x1b[49m\x1b[39m');
	assert.equal(color.underline.red.bgGreen('foo'), '\x1b[4m\x1b[31m\x1b[42mfoo\x1b[49m\x1b[39m\x1b[24m');
});

test('support nesting styles', () => {
	assert.equal(
		color.red('foo' + color.underline.bgBlue('bar') + '!'),
		'\x1b[31mfoo\x1b[4m\x1b[44mbar\x1b[49m\x1b[24m!\x1b[39m',
	);
});

test('support nesting styles of the same type (color, underline, bg)', () => {
	
	assert.equal(
		color.red('a' + color.yellow('b' + color.green('c') + 'b') + 'c'),
		'\x1b[31ma\x1b[33mb\x1b[32mc\x1b[33mb\x1b[31mc\x1b[39m',
	);
});

test('reset all styles with `.reset()`', () => {
	assert.equal(color.reset(color.red.bgGreen.underline('foo') + 'foo'), '\x1b[0m\x1b[31m\x1b[42m\x1b[4mfoo\x1b[24m\x1b[49m\x1b[39mfoo\x1b[0m');
});

test('support caching multiple styles', () => {
	const {red, green} = color.red;
	const redBold = red.bold;
	const greenBold = green.bold;

	assert.notEqual(red('foo'), green('foo'));
	assert.notEqual(redBold('bar'), greenBold('bar'));
	assert.notEqual(green('baz'), greenBold('baz'));
});

test('gray', () => {
	assert.equal(color.gray('foo'), '\x1b[90mfoo\x1b[39m');
});

test('support falsy values', () => {
	assert.equal(color.red(0), '\x1b[31m0\x1b[39m');
});

test('keep Function.prototype methods', () => {
	assert.equal(Reflect.apply(color.gray, null, ['foo']), '\x1b[90mfoo\x1b[39m');
});

test('throws with apply/call/bind', () => {
	assert.throws(() => {
		color.reset(color.red.bgGreen.underline.bind(null)('foo') + 'foo');
	});

	assert.throws(() => {
		color.red.blue.black.call(null, '');
	});

	assert.throws(() => {
		color.red.blue.black.apply(null, ['']);
	});
});


test('rbg', () => {
	assert.equal(color.hex('#FF0000')('hello'), '\x1b[38;2;255;0;0mhello\x1b[39m');
});

// test('properly convert RGB to 256 colors on basic color terminals', () => {
// 	assert.equal(new Chalk({level: 2}).hex('#FF0000')('hello'), '\x1b[38;5;196mhello\x1b[39m');
// 	assert.equal(new Chalk({level: 2}).bgHex('#FF0000')('hello'), '\x1b[48;5;196mhello\x1b[49m');
// 	assert.equal(new Chalk({level: 3}).bgHex('#FF0000')('hello'), '\x1b[48;2;255;0;0mhello\x1b[49m');
// });

// test('don\'t emit RGB codes if level is 0', () => {
// 	assert.equal(new Chalk({level: 0}).hex('#FF0000')('hello'), 'hello');
// 	assert.equal(new Chalk({level: 0}).bgHex('#FF0000')('hello'), 'hello');
// });

// test('supports blackBright color', () => {
// 	assert.equal(color.blackBright('foo'), '\x1b[90mfoo\x1b[39m');
// });

// test('sets correct level for colorStderr and respects it', () => {
// 	assert.equal(colorStderr.level, 3);
// 	assert.equal(colorStderr.red.bold('foo'), '\x1b[31m\x1b[1mfoo\x1b[22m\x1b[39m');
// });

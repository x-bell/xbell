import { test } from 'node:test';
import * as assert from 'assert';
import color from '../dist/index';

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


test('demo no throws', () => {
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
});

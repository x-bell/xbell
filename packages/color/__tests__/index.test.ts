import { test, expect } from 'xbell';
import color from '../src/index';

test('support automatic casting to string', () => {
	expect(color.bold(['foo', 'bar'])).toBe('\x1b[1mfoo,bar\x1b[22m');
	expect(color.green(98_765)).toBe('\x1b[32m98765\x1b[39m');
});

test('style string', () => {
	expect(color.underline('foo')).toBe('\x1b[4mfoo\x1b[24m');
	expect(color.red('foo')).toBe('\x1b[31mfoo\x1b[39m');
	expect(color.bgRed('foo')).toBe('\x1b[41mfoo\x1b[49m');
});

test('support applying multiple styles at once', () => {
	expect(color.red.bgGreen.underline('foo')).toBe('\x1b[31m\x1b[42m\x1b[4mfoo\x1b[24m\x1b[49m\x1b[39m');
	expect(color.underline.red.bgGreen('foo')).toBe('\x1b[4m\x1b[31m\x1b[42mfoo\x1b[49m\x1b[39m\x1b[24m');
});

test('support nesting styles', () => {
	expect(color.red('foo' + color.underline.bgBlue('bar') + '!')).toBe(
		'\x1b[31mfoo\x1b[4m\x1b[44mbar\x1b[49m\x1b[24m!\x1b[39m',
	);
});

test('support nesting styles of the same type (color, underline, bg)', () => {
	
	expect(
		color.red('a' + color.yellow('b' + color.green('c') + 'b') + 'c')).toBe(
		'\x1b[31ma\x1b[33mb\x1b[32mc\x1b[33mb\x1b[31mc\x1b[39m',
	);
});

test('reset all styles with `.reset()`', () => {
	expect(color.reset(color.red.bgGreen.underline('foo') + 'foo')).toBe('\x1b[0m\x1b[31m\x1b[42m\x1b[4mfoo\x1b[24m\x1b[49m\x1b[39mfoo\x1b[0m');
});

test('support caching multiple styles', () => {
	const {red, green} = color.red;
	const redBold = red.bold;
	const greenBold = green.bold;

	expect(red('foo')).not.toBe(green('foo'));
	expect(redBold('bar')).not.toBe(greenBold('bar'));
	expect(green('baz')).not.toBe(greenBold('baz'));
});

test('gray', () => {
	expect(color.gray('foo')).toBe('\x1b[90mfoo\x1b[39m');
});

test('support falsy values', () => {
	expect(color.red(0)).toBe('\x1b[31m0\x1b[39m');
});

test('keep Function.prototype methods', () => {
	expect(Reflect.apply(color.gray, null, ['foo'])).toBe('\x1b[90mfoo\x1b[39m');
});

test('throws with apply/call/bind', () => {
	expect(() => {
		color.reset(color.red.bgGreen.underline.bind(null)('foo') + 'foo');
	}).toThrow();

	expect(() => {
		color.red.blue.black.call(null, '');
	}).toThrow();

	expect(() => {
		color.red.blue.black.apply(null, ['']);
	}).toThrow();
});


test('rbg', () => {
	expect(color.hex('#FF0000')('hello')).toBe('\x1b[38;2;255;0;0mhello\x1b[39m');
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

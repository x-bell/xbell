const warnings = new Set([
	'--experimental-loader is an experimental feature. This feature could change at any time',
	'Custom ESM Loaders is an experimental feature. This feature could change at any time',
	'Importing JSON modules is an experimental feature. This feature could change at any time',
]);

const originEmit = process.emit;

// @ts-ignore
process.emit = function (event, code, ...otherArgs) {
	if (event === 'warning' && warnings.has(code?.message)) {
		return;
	}

	return Reflect.apply(originEmit, process, [event, code, ...otherArgs]);
};


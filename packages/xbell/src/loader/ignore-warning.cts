const warnings = [
	'--experimental-loader is an experimental feature. This feature could change at any time',
	'Custom ESM Loaders is an experimental feature. This feature could change at any time',
];

const originEmit = process.emit;

// @ts-ignore
process.emit = function (event: string, code: any, ...otherArgs) {
	if (event === 'warning' && warnings.includes(code?.message)) {
		return;
	}

	return Reflect.apply(originEmit, process, [event, code, ...otherArgs]);
};

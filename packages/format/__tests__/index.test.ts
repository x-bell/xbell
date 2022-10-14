import { format } from '../src';

function getArgumentsType(..._args: Array<unknown>) {
  return arguments;
}


const symbolInput = {
  a: 'aa',
  b: {
    innerB: 'bb',
  },
  [Symbol('symbol key')]: 'symbol value'
};

const symbolOutput = `{
  "a": "aa",
  "b": {
    "innerB": "bb"
  },
  Symbol(symbol key): "symbol value"
}`;

// TODO: use xbell test
const test = (description: string, cb: Function) => {
  try {
    cb();
  } catch(error: unknown) {
    console.error(`Case Failed: ${description}\n${error instanceof Error ? error.message: ''}`)
  }
}

const expect = (received: string) => {
  return {
    toBe(expected: string) {
      if (received != expected) {
        throw new Error( `Expected:\n${expected}\nReceived:\n${received}`)
      }
    }
  }
};

test('bool<true>', () => {
  expect(format(true)).toBe('true');
});

test('bool<false>', () => {
  expect(format(true)).toBe('true');
});

test('undefined', () => {
  expect(format(undefined)).toBe('undefined');
})

test('null', () => {
  expect(format(null)).toBe('null');
})

test('error', () => {
  expect(format(new Error())).toBe('[Error]');
});

test('error with msg', () => {
  expect(format(new Error('msg'))).toBe('[Error: msg]');
});


test('type error', () => {
  expect(format(new TypeError())).toBe('[TypeError]');
})

test('type error with msg', () => {
  expect(format(new TypeError('msg'))).toBe('[TypeError: msg]')
})

test('new function', () => {
  expect(format(new Function())).toBe('[Function anonymous]');
});

test('arrow function', () => {
  const arrowFun = () => {}
  expect(format(arrowFun)).toBe('[Function anonymous]');
});

test('function with name', () => {
  function myFun() {}
  expect(format(myFun)).toBe('[Function myFun]');
});

test('generator function with name', () => {
  function *genFun() {}
  expect(format(genFun)).toBe('[Function genFun]');
});

test('async function with name', () => {
  async function asyncFun() {}
  expect(format(asyncFun)).toBe('[Function asyncFun]');
});

test('number', () => {
  expect(format(2)).toBe('2');
});

test('negative number', () => {
  expect(format(-2)).toBe('-2');
});

test('0', () => {
  expect(format(0)).toBe('0');
});

test('-0', () => {
  expect(format(-0)).toBe('-0');
});

test('Infinity', () => {
  expect(format(Infinity)).toBe('Infinity');
})


test('-Infinity', () => {
  expect(format(-Infinity)).toBe('-Infinity');
})

test('zero bigint', () => {
  expect(format(BigInt(0))).toBe('0n');
});

test('negative zero bigint', () => {
  expect(format(BigInt(-0))).toBe('0n');
});

test('date', () => {
  expect(format(new Date(0))).toBe('1970-01-01T00:00:00.000Z')
})

test('invalid date', () => {
  expect(format(new Date(Infinity))).toBe('Date { NaN }');
});

test('empty array', () => {
  expect(format([])).toBe('Array []');
});

test('array with items', () => {
  expect(format([1, "abc", false, undefined, null])).toBe([
    'Array [',
    '  1,',
    '  "abc",',
    '  false,',
    '  undefined,',
    '  null',
    ']'
  ].join('\n'));
});

test('array with empty', () => {
  expect(format([,,,])).toBe([
    'Array [',
    '  ,',
    '  ,',
    '  ',
    ']'
  ].join('\n'));
});

test('nested array', () => {
  const val = [[1, "a", undefined, null]];
  expect(format(val)).toBe([
    'Array [',
    '  Array [',
    '    1,',
    '    "a",',
    '    undefined,',
    '    null',
    '  ]',
    ']',
  ].join('\n'));
});

test('empty arguments', () => {
  expect(format(getArgumentsType())).toBe('Arguments []');
});

test('arguments with items', () => {
  expect(format(getArgumentsType(
    1,
    "a",
    false,
    undefined,
    null
  ))).toBe([
    'Arguments [',
    '  1,',
    '  "a",',
    '  false,',
    '  undefined,',
    '  null',
    ']'
  ].join('\n'))
});


test('empty map', () => {
  expect(format( new Map())).toBe('Map {}');
});

test('map with string key value', () => {
  const map = new Map()
    .set('k1', 'v1')
    .set('k2', 'v2')
    .set('k3', 'v3');
  expect(format(map)).toBe([
    'Map {',
    '  "k1" => "v1",',
    '  "k2" => "v2",',
    '  "k3" => "v3"',
    '}'
  ].join('\n'))
})

test('map with complex key value', () => {
  const map = new Map<unknown, unknown>([
    [false, 'boolean'],
    ['false', 'string'],
    [0, 'number'],
    ['0', 'string'],
    [null, 'null'],
    ['null', 'string'],
    [undefined, 'undefined'],
    ['undefined', 'string'],
    [Symbol('description'), 'symbol'],
    ['Symbol(description)', 'string'],
    [['array', 'key'], 'array'],
    [{key: 'value'}, 'object'],
  ]);
  const expected = [
    'Map {',
    '  false => "boolean",',
    '  "false" => "string",',
    '  0 => "number",',
    '  "0" => "string",',
    '  null => "null",',
    '  "null" => "string",',
    '  undefined => "undefined",',
    '  "undefined" => "string",',
    '  Symbol(description) => "symbol",',
    '  "Symbol(description)" => "string",',
    '  Array [',
    '    "array",',
    '    "key"',
    '  ] => "array",',
    '  Object {',
    '    "key": "value"',
    '  } => "object"',
    '}',
  ].join('\n');
  expect(format(map)).toBe(expected);
})

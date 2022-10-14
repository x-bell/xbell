import { expell } from '../src';
import { test } from './internal-test';
import { format } from '@xbell/format';

test('#toBe: does not throw', () => {
  expell('a').not.toBe('b');
  expell('a').toBe('a');
  expell(1).not.toBe(2);
  expell(1).toBe(1);
  expell(null).not.toBe(undefined);
  expell(null).toBe(null);
  expell(undefined).toBe(undefined);
  expell(NaN).toBe(NaN);
  expell(BigInt(1)).not.toBe(BigInt(2));
  expell(BigInt(1)).not.toBe(1);
  expell(BigInt(1)).toBe(BigInt(1));
});

[
  [true, false],
  [1, 2],
  [0, -0],
  [0, Number.MIN_VALUE],
  [Number.MIN_VALUE, 0],
  [0, new Number(0)],
  [new Number(0), 0],
  [new Number(0), new Number(1)],
  ['abc', new String('abc')],
  [new String('abc'), 'abc'],
  [/abc/gsy, /abc/g],
  [{a: 1}, {a: 2}],
  [{a: 5}, {b: 6}],
  [Object.freeze({foo: {bar: 1}}), {foo: {}}],
  [
    {
      get getterAndSetter() {
        return {};
      },
      set getterAndSetter(value) {
        throw new Error('noo');
      },
    },
    {getterAndSetter: {foo: 'bar'}},
  ],
  [
    Object.freeze({
      get frozenGetterAndSetter() {
        return {};
      },
      set frozenGetterAndSetter(value) {
        throw new Error('noo');
      },
    }),
    {frozenGetterAndSetter: {foo: 'bar'}},
  ],
  [
    {
      get getter() {
        return {};
      },
    },
    {getter: {foo: 'bar'}},
  ],
  [
    Object.freeze({
      get frozenGetter() {
        return {};
      },
    }),
    {frozenGetter: {foo: 'bar'}},
  ],
  [
    {
      set setter(value: any) {
        throw new Error('noo');
      },
    },
    {setter: {foo: 'bar'}},
  ],
  [
    Object.freeze({
      // eslint-disable-next-line accessor-pairs
      set frozenSetter(value: any) {
        throw new Error('noo');
      },
    }),
    {frozenSetter: {foo: 'bar'}},
  ],
  ['banana', 'apple'],
  ['1\u{00A0}234,57\u{00A0}$', '1 234,57 $'], // issues/6881
  [
    'type TypeName<T> = T extends Function ? "function" : "object";',
    'type TypeName<T> = T extends Function\n? "function"\n: "object";',
  ],
  [null, undefined],
  [[1], [2]],
  [
    [1, 2],
    [2, 1],
  ],
  [new Map(), new Set()],
  [new Set([1, 2]), new Set()],
  [new Set([1, 2]), new Set([1, 2, 3])],
  [new Set([[1], [2]]), new Set([[1], [2], [3]])],
  [new Set([[1], [2]]), new Set([[1], [2], [2]])],
  [
    new Set([new Set([1]), new Set([2])]),
    new Set([new Set([1]), new Set([3])]),
  ],
  [
    new Map([
      [1, 'one'],
      [2, 'two'],
    ]),
    new Map([[1, 'one']]),
  ],
  [new Map([['a', 0]]), new Map([['b', 0]])],
  [new Map([['v', 1]]), new Map([['v', 2]])],
  [new Map([[['v'], 1]]), new Map([[['v'], 2]])],
  [
    new Map([[[1], new Map([[[1], 'one']])]]),
    new Map([[[1], new Map([[[1], 'two']])]]),
  ],
  [new Uint8Array([97, 98, 99]), new Uint8Array([97, 98, 100])],
  [
    'Eve',
    {
      asymmetricMatch: function asymmetricMatch(who: any) {
        return who === 'Alice' || who === 'Bob';
      },
    },
  ],
  [
    {
      target: {
        nodeType: 1,
        value: 'a',
      },
    },
    {
      target: {
        nodeType: 1,
        value: 'b',
      },
    },
  ],
  [
    {
      nodeName: 'div',
      nodeType: 1,
    },
    {
      nodeName: 'p',
      nodeType: 1,
    },
  ],
  [
    {
      [Symbol.for('foo')]: 1,
      [Symbol.for('bar')]: 2,
    },
  ],
  [
    // eslint-disable-next-line no-sparse-arrays
    [, , 1, ,],
    // eslint-disable-next-line no-sparse-arrays
    [, , 2, ,],
  ],
  [
    Object.assign([], {4294967295: 1}),
    Object.assign([], {4294967295: 2}), // issue 11056
  ],
  [
    // eslint-disable-next-line no-useless-computed-key
    Object.assign([], {['-0']: 1}),
    // eslint-disable-next-line no-useless-computed-key
    Object.assign([], {['0']: 1}), // issue 11056: also check (-0, 0)
  ],
  [
    Object.assign([], {a: 1}),
    Object.assign([], {b: 1}), // issue 11056: also check strings
  ],
  [
    Object.assign([], {[Symbol()]: 1}),
    Object.assign([], {[Symbol()]: 1}), // issue 11056: also check symbols
  ],
].forEach(([a, b]) => {
  test(`{pass: false} expect(${format(a)}).toEqual(${format(
    b,
  )})`, () => {
    expell(a).not.toEqual(b);
  });
});

test('#toBeFalsy()', () => {
  expell(0).toBeFalsy();
  expell(null).toBeFalsy();
  expell(undefined).toBeFalsy();
  expell(false).toBeFalsy();
  expell(NaN).toBeFalsy();
});

test('#toBeTruthy()', () => {
  expell(1).toBeTruthy();
  expell(-1).toBeTruthy();
  expell(true).toBeTruthy();
  expell({}).toBeTruthy();
  expell([]).toBeTruthy();
});

test('#toBeDefined()', () => {
  expell({}).toBeDefined();
  expell([]).toBeDefined();
  expell('').toBeDefined();
  expell(null).toBeDefined();
});

test('#toBeUndefined()', () => {
  expell(undefined).toBeUndefined();
  expell({}).not.toBeUndefined();
});

test('toBeInstanceOf', () => {
  class A {}
  class B {}
  class C extends B {}
  class D extends C {}
  class E extends D {}

  class SubHasStaticNameMethod extends B {
    constructor() {
      super();
    }
    static name() {}
  }

  class HasStaticNameMethod {
    constructor() {}
    static name() {}
  }

  function DefinesNameProp() {}
  Object.defineProperty(DefinesNameProp, 'name', {
    configurable: true,
    enumerable: false,
    value: '',
    writable: true,
  });
  class SubHasNameProp extends DefinesNameProp {}

  [
    [new Map(), Map],
    [[], Array],
    [new A(), A],
    [new C(), B], // C extends B
    [new E(), B], // E extends … extends B
    [new SubHasNameProp(), DefinesNameProp], // omit extends
    [new SubHasStaticNameMethod(), B], // Received
    [new HasStaticNameMethod(), HasStaticNameMethod], // Expected
  ].forEach(([a, b]) => {
    test(`passing ${format(a)} and ${format(b)}`, () => {
      expell(a).toBeInstanceOf(b);
    });
  })
});

test('#toBeNull', () => {
  expell(null).toBeNull();
  expell(undefined).not.toBeNull();
});



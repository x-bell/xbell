// from jest
const IteratorSymbol = Symbol.iterator;

function hasKey(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isDomNode(obj: any): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.nodeType === 'number' &&
    typeof obj.nodeName === 'string' &&
    typeof obj.isEqualNode === 'function'
  );
}

function keys(obj: object, hasKey: (obj: object, key: string) => boolean) {
  var keys = [];
  for (var key in obj) {
    if (hasKey(obj, key)) {
      keys.push(key);
    }
  }
  return keys.concat(
    (Object.getOwnPropertySymbols(obj) as Array<any>).filter(
      symbol =>
        (Object.getOwnPropertyDescriptor(obj, symbol) as PropertyDescriptor)
          .enumerable,
    ),
  );
}

function isAsymmetric(obj: any) {
  return !!obj && isA('Function', obj.asymmetricMatch);
}

const hasIterator = (object: any) =>
  !!(object != null && object[IteratorSymbol]);


function isA(typeName: string, value: unknown) {
  return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
}

export const iterableEquality = (
  a: any,
  b: any,
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  aStack: Array<any> = [],
  bStack: Array<any> = [],
): boolean | undefined => {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    Array.isArray(a) ||
    Array.isArray(b) ||
    !hasIterator(a) ||
    !hasIterator(b)
  ) {
    return undefined;
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  let length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    // circular references at same depth are equal
    // circular reference is not equal to non-circular one
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }
  aStack.push(a);
  bStack.push(b);

  const iterableEqualityWithStack = (a: any, b: any) =>
    iterableEquality(a, b, [...aStack], [...bStack]);

  if (a.size !== undefined) {
    if (a.size !== b.size) {
      return false;
    } else if (isA('Set', a)) {
      let allFound = true;
      for (const aValue of a) {
        if (!b.has(aValue)) {
          let has = false;
          for (const bValue of b) {
            const isEqual = equals(aValue, bValue, [iterableEqualityWithStack]);
            if (isEqual === true) {
              has = true;
            }
          }

          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      // Remove the first value from the stack of traversed values.
      aStack.pop();
      bStack.pop();
      return allFound;
    } else if (isA('Map', a)) {
      let allFound = true;
      for (const aEntry of a) {
        if (
          !b.has(aEntry[0]) ||
          !equals(aEntry[1], b.get(aEntry[0]), [iterableEqualityWithStack])
        ) {
          let has = false;
          for (const bEntry of b) {
            const matchedKey = equals(aEntry[0], bEntry[0], [
              iterableEqualityWithStack,
            ]);

            let matchedValue = false;
            if (matchedKey === true) {
              matchedValue = equals(aEntry[1], bEntry[1], [
                iterableEqualityWithStack,
              ]);
            }
            if (matchedValue === true) {
              has = true;
            }
          }

          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      // Remove the first value from the stack of traversed values.
      aStack.pop();
      bStack.pop();
      return allFound;
    }
  }

  const bIterator = b[IteratorSymbol]();

  for (const aValue of a) {
    const nextB = bIterator.next();
    if (
      nextB.done ||
      !equals(aValue, nextB.value, [iterableEqualityWithStack])
    ) {
      return false;
    }
  }
  if (!bIterator.next().done) {
    return false;
  }

  const aEntries = Object.entries(a);
  const bEntries = Object.entries(b);
  if (!equals(aEntries, bEntries)) {
    return false;
  }

  // Remove the first value from the stack of traversed values.
  aStack.pop();
  bStack.pop();
  return true;
};

export const typeEquality = (a: any, b: any): boolean | undefined => {
  if (a == null || b == null || a.constructor === b.constructor) {
    return undefined;
  }

  return false;
};

export const sparseArrayEquality = (
  a: unknown,
  b: unknown,
): boolean | undefined => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return undefined;
  }

  // A sparse array [, , 1] will have keys ["2"] whereas [undefined, undefined, 1] will have keys ["0", "1", "2"]
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  return (
    equals(a, b, [iterableEquality, typeEquality], true) && equals(aKeys, bKeys)
  );
};

export const arrayBufferEquality = (
  a: unknown,
  b: unknown,
): boolean | undefined => {
  if (!(a instanceof ArrayBuffer) || !(b instanceof ArrayBuffer)) {
    return undefined;
  }

  const dataViewA = new DataView(a);
  const dataViewB = new DataView(b);

  // Buffers are not equal when they do not have the same byte length
  if (dataViewA.byteLength !== dataViewB.byteLength) {
    return false;
  }

  // Check if every byte value is equal to each other
  for (let i = 0; i < dataViewA.byteLength; i++) {
    if (dataViewA.getUint8(i) !== dataViewB.getUint8(i)) {
      return false;
    }
  }

  return true;
};

export type Tester = (a: any, b: any) => boolean | undefined;

function asymmetricMatch(a: any, b: any) {
  var asymmetricA = isAsymmetric(a),
    asymmetricB = isAsymmetric(b);

  if (asymmetricA && asymmetricB) {
    return undefined;
  }

  if (asymmetricA) {
    return a.asymmetricMatch(b);
  }

  if (asymmetricB) {
    return b.asymmetricMatch(a);
  }
}


// Equality function lovingly adapted from isEqual in
//   [Underscore](http://underscorejs.org)
function eq(
  a: any,
  b: any,
  aStack: Array<unknown>,
  bStack: Array<unknown>,
  customTesters: Array<Tester>,
  strictCheck: boolean | undefined,
): boolean {
  var result = true;

  var asymmetricResult = asymmetricMatch(a, b);
  if (asymmetricResult !== undefined) {
    return asymmetricResult;
  }

  for (var i = 0; i < customTesters.length; i++) {
    var customTesterResult = customTesters[i](a, b);
    if (customTesterResult !== undefined) {
      return customTesterResult;
    }
  }

  if (a instanceof Error && b instanceof Error) {
    return a.message == b.message;
  }

  if (Object.is(a, b)) {
    return true;
  }
  // A strict comparison is necessary because `null == undefined`.
  if (a === null || b === null) {
    return a === b;
  }
  var className = Object.prototype.toString.call(a);
  if (className != Object.prototype.toString.call(b)) {
    return false;
  }
  switch (className) {
    case '[object Boolean]':
    case '[object String]':
    case '[object Number]':
      if (typeof a !== typeof b) {
        // One is a primitive, one a `new Primitive()`
        return false;
      } else if (typeof a !== 'object' && typeof b !== 'object') {
        // both are proper primitives
        return Object.is(a, b);
      } else {
        // both are `new Primitive()`s
        return Object.is(a.valueOf(), b.valueOf());
      }
    case '[object Date]':
      // Coerce dates to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b;
    // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return a.source === b.source && a.flags === b.flags;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // Use DOM3 method isEqualNode (IE>=9)
  if (isDomNode(a) && isDomNode(b)) {
    return a.isEqualNode(b);
  }

  // Used to detect circular references.
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    // circular references at same depth are equal
    // circular reference is not equal to non-circular one
    if (aStack[length] === a) {
      return bStack[length] === b;
    } else if (bStack[length] === b) {
      return false;
    }
  }
  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);
  // Recursively compare objects and arrays.
  // Compare array lengths to determine if a deep comparison is necessary.
  if (strictCheck && className == '[object Array]' && a.length !== b.length) {
    return false;
  }

  // Deep compare objects.
  var aKeys = keys(a, hasKey),
    key;

  var bKeys = keys(b, hasKey);
  // Add keys corresponding to asymmetric matchers if they miss in non strict check mode
  if (!strictCheck) {
    for (var index = 0; index !== bKeys.length; ++index) {
      key = bKeys[index];
      if ((isAsymmetric(b[key]) || b[key] === undefined) && !hasKey(a, key)) {
        aKeys.push(key);
      }
    }
    for (var index = 0; index !== aKeys.length; ++index) {
      key = aKeys[index];
      if ((isAsymmetric(a[key]) || a[key] === undefined) && !hasKey(b, key)) {
        bKeys.push(key);
      }
    }
  }

  // Ensure that both objects contain the same number of properties before comparing deep equality.
  var size = aKeys.length;
  if (bKeys.length !== size) {
    return false;
  }

  while (size--) {
    key = aKeys[size];

    // Deep compare each member
    if (strictCheck)
      result =
        hasKey(b, key) &&
        eq(a[key], b[key], aStack, bStack, customTesters, strictCheck);
    else
      result =
        (hasKey(b, key) || isAsymmetric(a[key]) || a[key] === undefined) &&
        eq(a[key], b[key], aStack, bStack, customTesters, strictCheck);

    if (!result) {
      return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();

  return result;
}

export type EqualsFunction = (
  a: unknown,
  b: unknown,
  customTesters?: Array<Tester>,
  strictCheck?: boolean,
) => boolean;

// Extracted out of jasmine 2.5.2
export const equals: EqualsFunction = (a, b, customTesters, strictCheck) => {
  customTesters = customTesters || [];
  return eq(a, b, [], [], customTesters, strictCheck);
};

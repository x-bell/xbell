import type { DynamicImportItem, ImportItem, RequireItem } from '../src/types';

import { test } from 'xbell';
import { parse } from '@swc/core';
import { analyse } from '../src/analyse';

test('#analyse - lib', async ({ expect }) => {
  const program = await parse(`
    import React from 'react';
    import { render } from 'react-dom';
    import * as url from 'node:url';
    const dynamic = await import('dynamic');
    const req = require('req');
  `);

  const { imports, dynamicImports, requires } = analyse(program)
  expect(imports).toEqual([
    {
      onlyImportDefault: true,
      path: 'react',
    },
    {
      onlyImportDefault: false,
      path: 'react-dom',
    },
    {
      onlyImportDefault: false,
      path: 'node:url',
    }
  ] as ImportItem[])
  expect(dynamicImports).toEqual([
    {
      path: 'dynamic'
    }
  ] as DynamicImportItem[]);

  expect(requires).toEqual([
    {
      path: 'req'
    }
  ] as RequireItem[])
});


test('#analyse - scope', async ({ expect }) => {
  const program = await parse(`
    import * as aa from '@scope/aa';
    import { bb } from '@scope/bb';
    import cc from '@scope/cc';
    `);

  const { imports } = analyse(program)
  expect(imports).toEqual([
    {
      onlyImportDefault: false,
      path: '@scope/aa',
    },
    {
      onlyImportDefault: false,
      path: '@scope/bb',
    },
    {
      onlyImportDefault: true,
      path: '@scope/cc',
    },
  ] as ImportItem[])
});


test('#analyse - relative', async ({ expect }) => {
  const program = await parse(`
    import * as aa from './aa';
    import { bb } from '../bb';
    import cc from './mods/cc';
    `);

  const { imports } = analyse(program)
  expect(imports).toEqual([
    {
      onlyImportDefault: false,
      path: './aa',
    },
    {
      onlyImportDefault: false,
      path: '../bb',
    },
    {
      onlyImportDefault: true,
      path: './mods/cc',
    },
  ] as ImportItem[])
});

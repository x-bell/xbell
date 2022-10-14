import {
  parseSync,
  CallExpression,
  Expression,
  transformSync,
} from '@swc/core';
import { ViteDevServer } from 'vite';

import { tsParserConfig, jscConfig } from './config';
import { Visitor } from './visitor';




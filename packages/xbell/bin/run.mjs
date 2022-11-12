#!/usr/bin/env node --require xbell/loader/ignore-warning.cjs --loader xbell/loader/loader.mjs
process.setSourceMapsEnabled(true);

import '../dist/cli.mjs';

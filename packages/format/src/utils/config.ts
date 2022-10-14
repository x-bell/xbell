import type { FormatOptions, FormatConfig } from '../types';

export function checkOptions(options: unknown) {
  
}

export function optionsToConfig(options: FormatOptions = {}): FormatConfig {
  return {
    ignoreFunctionName: !!options.ignoreFunctionName,
    maxDepth: options.maxDepth ?? false,
    innerSeparator: options.inline ? '' : '\n',
    outerSeparator: options.inline ? ' ' : '\n',
    indent: options.indent ?? 2,
    inline: !!options.inline,
  }
}

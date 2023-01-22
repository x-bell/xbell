import type { RawSourceMap } from 'source-map-js';
import type { Awaitable } from './utils';

type TransformedSource = {
  code: string;
  map?: RawSourceMap | string | null;
};

export interface Transformer {
  process(
    sourceText: string,
    sourcePath: string,
  ): Awaitable<TransformedSource>;
}

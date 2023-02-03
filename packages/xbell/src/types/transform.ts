import type { RawSourceMap } from 'source-map-js';
import type { Awaitable } from './utils';

export interface TransformedSource {
  code: string;
  map?: RawSourceMap | string | null;
};

export interface Transformer {
  transform(
    code: string,
    filename: string,
  ): Awaitable<TransformedSource>;
  name: string;
  match: RegExp;
}

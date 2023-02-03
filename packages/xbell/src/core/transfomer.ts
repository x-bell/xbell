import * as fs from 'node:fs/promises';
import { configurator } from '../common/configurator';
import type { Transformer, TransformedSource } from '../types';

function uniqTransformers(transformers: Transformer[]) {
  const record: Record<string, true | undefined> = {};
  return transformers.filter(transformer => {
    if (record[transformer.name]) {
      return false;
    }
    record[transformer.name] = true;
    return true;
  });
}

export class CodeTransfomer {
  userTransfomers?: Transformer[];

  cache: Map<string, TransformedSource> = new Map();

  getUserTransfomers() {
    const { globalConfig } = configurator;

    if (!this.userTransfomers) {
      this.userTransfomers = uniqTransformers(globalConfig.transformers);
    }
    return this.userTransfomers;
  }

  async compileByTransformers({
    transformers,
    code,
    filename
  }: {
    transformers: Transformer[];
    code: string;
    filename: string;
  }) {
    // TODO: source map
    let finalCode = code;
    let ret: TransformedSource = {
      code,
      map: null,
    }
    for (const transfomer of transformers) {
      ret = await transfomer.transform(ret.code, filename);
    }

    return ret;
  }

  getMatchTransformers(filename: string): Transformer[] {
    const transformers = this.getUserTransfomers();
    return transformers.filter(({ match }) => match.test(filename));
  }

  async transform(filename: string): Promise<TransformedSource> {
    const code = await fs.readFile(filename, 'utf-8');
    const transformers = this.getMatchTransformers(filename);
    if (transformers.length) {
      this.cache.set(filename, await this.compileByTransformers({
        filename,
        code,
        transformers,
      }));
      return this.cache.get(filename)!;
    }

    this.cache.set(filename, {
      code,
    });
    return this.cache.get(filename)!;
  }

  async transformHtml({ content, filename }: { content?: string; filename?: string; }): Promise<string> {
    if (!content && filename) {
      content = await fs.readFile(filename, 'utf-8');
    }

    return content!;
  }
}

export const transfomer = new CodeTransfomer();

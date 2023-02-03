import * as fs from 'node:fs/promises';
import { configurator } from '../common/configurator';
import type { Transformer, TransformedSource } from '../types';

interface UserTransfomer {
  match: RegExp;
  transfomer: Transformer;
}

export class CodeTransfomer {
  userTransfomers?: UserTransfomer[];

  cache: Map<string, TransformedSource> = new Map();

  getUserTransfomers() {
    const { globalConfig } = configurator;

    if (!this.userTransfomers) {
      this.userTransfomers = Object
        .entries(globalConfig.transform ?? {})
        .map(([regString, transfomer]) => {
          return {
            match: new RegExp(regString),
            transfomer,
          };
        });
    }

    return this.userTransfomers;
  }

  getMatchTransformer(filename: string) {
    const transfomers = this.getUserTransfomers();
    return transfomers.find(({ match }) => match.test(filename))?.transfomer;
  }

  async transform(filename: string): Promise<TransformedSource> {
    const code = await fs.readFile(filename, 'utf-8');
    const transfomer = this.getMatchTransformer(filename);
    if (transfomer) {
      this.cache.set(filename, await transfomer.process(code, filename));
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

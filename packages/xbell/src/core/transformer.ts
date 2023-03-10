import * as fs from 'node:fs/promises';
import { configurator } from '../common/configurator';
import type { Loader, TransformedSource } from '../types';
import { compile } from '@xbell/compiler';
import debug from 'debug';
import { pathManager } from '../common/path-manager';

const debugTransformer = debug('xbell:transformer');

function uniqLoaders(loaders: Loader[]) {
  const record: Record<string, true | undefined> = {};
  return loaders.filter(loader => {
    if (record[loader.name]) {
      return false;
    }
    record[loader.name] = true;
    return true;
  });
}

const compileOptions = {
  extensions: [".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"],
  conditions: ["import",],
  cwd: pathManager.projectDir,
}

export class CodeTransfomer {
  userLoaders?: Loader[];

  cache: Map<string, TransformedSource> = new Map();

  getUserLoaders() {
    const { globalConfig } = configurator;

    if (!this.userLoaders) {
      this.userLoaders = uniqLoaders(globalConfig.loaders);
    }
    return this.userLoaders;
  }

  async transformByLoaders({
    loaders,
    code,
    filename
  }: {
    loaders: Loader[];
    code: string;
    filename: string;
  }) {
    // TODO: source map
    let finalCode = code;
    let ret: TransformedSource = {
      code,
      map: null,
    }
    for (const loader of loaders) {
      ret = await loader.transform(ret.code, filename);
    }
    return ret;
  }

  getMatchLoaders(filename: string): Loader[] {
    const loaders = this.getUserLoaders();
    return loaders.filter(({ match }) => match.test(filename));
  }

  async transform(filename: string, sourceCode?: string, opts?: {
    isCallbackFunction: boolean;
  }): Promise<TransformedSource> {
    const code = sourceCode ?? await fs.readFile(filename, 'utf-8');
    const loaders = this.getMatchLoaders(filename);
    const resultByLoaders = loaders.length ? await this.transformByLoaders({
      filename,
      code,
      loaders,
    }) : { code };

    debugTransformer('==before==', 'filename:', filename, 'code:', resultByLoaders.code);
    const codeByCompiler = compile(resultByLoaders.code, filename, {
      ...compileOptions,
      isCallbackFunction: !!opts?.isCallbackFunction,
    })
    debugTransformer('==after==', 'filename:', filename, 'code:', codeByCompiler);

    this.cache.set(filename, {
      code: codeByCompiler,
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

export const transformer = new CodeTransfomer();

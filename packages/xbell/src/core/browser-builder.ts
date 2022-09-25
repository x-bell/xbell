import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  createServer,
  defineConfig,
  mergeConfig,
  InlineConfig,
  ViteDevServer
} from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import vue from '@vitejs/plugin-vue';
import type { XBellWorkerQueryModuleUrl } from '../types';
import { get } from '../utils/http';


class BrowserBuilder {
  protected _server?: Promise<{
    queryUrl(path: string, importer?: string): Promise<string | undefined>;
    port: number;
  }>;

  get server() {
    this._server = this._server ?? this.startServer();
    return this._server!;
  }

  protected async startServer() {
    const projectDir = process.cwd();
    // const targetConfigFile = viteConfigNames.map(filename => join(projectDir, filename)).find(filename => existsSync(
    //   filename
    // ));
    // const { default: projectConfig } = targetConfigFile ? await import(targetConfigFile) : { default: {} };
    const testConfig = defineConfig({
      base: `/${XBELL_BUNDLE_PREFIX}/`,
      optimizeDeps: {
        // disable vite warning [https://github.com/vitejs/vite/blob/e7712ffb68b24fc6eafb9359548cf92c15a156c1/packages/vite/src/node/optimizer/scan.ts#L82]
        entries: '/___xbell_empty_vite_entry__/'
      },
      server: {
        hmr: false,
      },
      plugins: [
        vue(),
        istanbul({
          exclude: ['node_modules', 'test/'],
          extension: ['.js', '.ts', '.jsx', '.tsx', '.mjs', 'cjs'],
        }),
      ],
      build: {
        sourcemap: true,
      },
    });
    const finalConfig: InlineConfig = {
      ...testConfig,
      configFile: false,
    }
    const server = await createServer(finalConfig);
  
    await server.listen();
    const addressInfo = server.httpServer?.address()!;

    const { port } = addressInfo as Exclude<typeof addressInfo, string>;
    // NOTE: vite must fetch internal modules first. otherwise, other requests cannot be answered
    await get(`http://localhost:${port}/${XBELL_BUNDLE_PREFIX}/@vite/env`);
    return {
      async queryUrl(path: string, importer: string) {
        const ret = await server.pluginContainer.resolveId(path, importer, { ssr: false });
        return ret?.id
      },
      port,
    };
  }

}

export const browserBuilder = new BrowserBuilder();

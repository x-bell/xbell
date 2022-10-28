import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { RawSourceMap } from 'source-map-js';
import {
  createServer,
  defineConfig,
  mergeConfig,
  InlineConfig,
} from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import type { XBellWorkerQueryModuleUrl } from '../types';
import { get } from '../utils/http';
import { configurator } from '../common/configurator';
import debug from 'debug';

const debugBrowserBuilder = debug('xbell:BrowserBuilder');

class BrowserBuilder {
  protected _server?: Promise<{
    queryUrl(path: string, importer?: string): Promise<string | undefined>;
    port: number;
    getModuleByUrl(url: string): Promise<{ code: string, map: RawSourceMap | null } | undefined>;
  }>;

  get server() {
    this._server = this._server ?? this.startServer();
    return this._server!;
  }

  protected async startServer() {
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
        istanbul({
          exclude: ['node_modules', 'test/'],
          extension: ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.vue'],
          requireEnv: false,
        }),
      ],
      build: {
        sourcemap: true,
      },
    });
    const userViteConfig = configurator.globalConfig.browser.devServer?.viteConfig;
    const finalConfig: InlineConfig = mergeConfig(
      userViteConfig || {},
      { ...testConfig, configFile: false, }
    );

    debugBrowserBuilder('userViteConfig', userViteConfig);
    debugBrowserBuilder('finalConfigPlugins', finalConfig.plugins);
    const server = await createServer(finalConfig);
  
    await server.listen();
    const addressInfo = server.httpServer?.address()!;

    const { port } = addressInfo as Exclude<typeof addressInfo, string>;
    // NOTE: vite must fetch internal modules first. otherwise, other requests cannot be answered
    await get(`http://localhost:${port}/${XBELL_BUNDLE_PREFIX}/@vite/env`);
    return {
      async queryUrl(path: string, importer: string) {
        debugBrowserBuilder('resolveId', {
          path,
          importer
        });
        const ret = await server.pluginContainer.resolveId(path, importer, { ssr: false });
        return ret?.id
      },
      port,
      async getModuleByUrl(url: string) {
        const res = server.moduleGraph.getModuleById(url);
        if (res?.transformResult) {
          const map = res.transformResult.map;
          return {
            map: map && {
              ...map,
              version: String(map.version),
            },
            code: res.transformResult.code,
          }
        }
        return undefined;
        // return Promise.all([
        //   // server.moduleGraph.getModulesByFile('file:///Users/lianghang/Desktop/github/xlianghang/bell/tests/internal/src/utils/error.ts'),
        //   // server.moduleGraph.getModulesByFile('/Users/lianghang/Desktop/github/xlianghang/bell/tests/internal/src/utils/error.ts'),
        //   // server.moduleGraph.getModuleByUrl('https://xbell.test/__xbell_bundle_prefix__/src/utils/error.ts'),
        //   // server.moduleGraph.getModuleByUrl('/__xbell_bundle_prefix__/src/utils/error.ts'),
        // ]);
      },
    };
  }

  async test() {
    const s = await this._server;

  }

}

export const browserBuilder = new BrowserBuilder();

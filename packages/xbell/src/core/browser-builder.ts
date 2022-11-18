import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { RawSourceMap } from 'source-map-js';
import {
  createServer,
  defineConfig,
  mergeConfig,
  InlineConfig,
  preview
} from 'vite';
import { viteCoveragePlugin } from '@xbell/coverage';
import { XBELL_BUNDLE_PREFIX } from '../constants/xbell';
import type { XBellWorkerQueryModuleUrl } from '../types';
import { get } from '../utils/http';
import { configurator } from '../common/configurator';
import debug from 'debug';
import { pathManager } from '../common/path-manager';

const debugBrowserBuilder = debug('xbell:BrowserBuilder');

(await preview({})).httpServer

class BrowserBuilder {
  protected _server?: Promise<{
    queryId(path: string, importer?: string): Promise<string | undefined>;
    queryUrl(path: string, importer?: string): Promise<string | undefined>;
    port: number;
    getModuleById(url: string): Promise<{ code: string, map: RawSourceMap | null } | undefined>;
    transformIndexHtml(url: string, html: string): Promise<string>;
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
    const { coverage } = configurator.globalConfig;
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
        coverage?.enabled ? viteCoveragePlugin({
          exclude: coverage.exclude,
          include: coverage.include,
        }) : undefined,
      ].filter(Boolean),
      build: {
        sourcemap: true,
      },
    });
    const rawUserViteConfig = configurator.globalConfig.browser.devServer?.viteConfig;
    const userViteConfig = await (typeof rawUserViteConfig === 'function' ? rawUserViteConfig({ mode: 'testing', ssrBuild: false, command: 'serve' }) : rawUserViteConfig);
    const finalConfig: InlineConfig = mergeConfig(
      userViteConfig || {},
      { ...testConfig, configFile: false, root: pathManager.projectDir, } as InlineConfig
    );

    debugBrowserBuilder('userViteConfig', userViteConfig);
    debugBrowserBuilder('finalConfigPlugins', finalConfig.plugins);
    const server = await createServer(finalConfig);
  
    await server.listen();
    const addressInfo = server.httpServer?.address()!;

    const { port } = addressInfo as Exclude<typeof addressInfo, string>;
    // NOTE: vite must fetch internal modules first. otherwise, other requests cannot be answered
    await get(`http://localhost:${port}/${XBELL_BUNDLE_PREFIX}/@vite/env`);

    async function queryId(path: string, importer?: string) {
      debugBrowserBuilder('resolveId', {
        path,
        importer
      });
      const ret = await server.pluginContainer.resolveId(path, importer, { ssr: false });
      return ret?.id
    };
    return {
      queryId,
      port,
      async getModuleById(id: string) {
        const res = server.moduleGraph.getModuleById(id);
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
      },
      async getModuleByUrl(url: string) {
        const mod = await server.moduleGraph.getModuleByUrl(url);
        debugBrowserBuilder('module', mod);
        return mod;
      },
      async queryUrl(path: string, importer?: string): Promise<string | undefined> {
        const id = await queryId(path, importer);
        // const loadResult =  id ? await server.pluginContainer.resolveId(id) : undefined;
        // const moduleInfo = id ? server.pluginContainer.getModuleInfo(id) : undefined;

        const ret = id ? server.moduleGraph.getModuleById(id) : undefined;
        // const retFile = id ? server.moduleGraph.getModulesByFile(id) : undefined;
        // debugBrowserBuilder('id', path, id, url, moduleInfo, ret, retFile, code);
        return ret?.url;
      },
      transformIndexHtml(url: string, html: string) {
        return server.transformIndexHtml(url, html);
      }
    };
  }
}

export const browserBuilder = new BrowserBuilder();

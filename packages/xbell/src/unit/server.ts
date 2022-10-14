import { existsSync } from 'fs';
import { join } from 'path';
import { createServer, defineConfig, mergeConfig, InlineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

const viteConfigNames = [
  'vite.config.ts',
]
export async function startServer(projectDir: string) {
  const targetConfigFile = viteConfigNames.map(filename => join(projectDir, filename)).find(filename => existsSync(
    filename
  ));
  const { default: projectConfig } = targetConfigFile ? await import(targetConfigFile) : { default: {} };
  const testConfig = defineConfig({
    server: {
      base: '/xbell/',
      hmr: false,
    },
    plugins: [
      istanbul({
        exclude: ['node_modules', 'test/'],
        extension: ['.js', '.ts', '.jsx', '.tsx'],
      }),
    ],
    build: {
      sourcemap: true,
    }
  });
  const finalConfig: InlineConfig = {
    ...mergeConfig(projectConfig, testConfig),
    configFile: false,
  }
  const server = await createServer(finalConfig);



  await server.listen();
  return server;
}
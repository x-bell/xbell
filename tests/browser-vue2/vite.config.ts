import { defineConfig } from 'vite'
import { Vue2Loader } from '@xbell/vue2/loader';

function vue2PluginForVite() {
  return {
    name: Vue2Loader.name,
    async transform(sourceCode: string, filename: string) {
      if (Vue2Loader.match.test(filename)) {
        const { code } = await Vue2Loader.transform(sourceCode, filename);
        return {
          code,
        };
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2PluginForVite(),
  ],
});

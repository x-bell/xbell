import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { createHash } from 'node:crypto';
import * as compiler from 'vue/compiler-sfc';
import { Vue2Transfomer } from '@xbell/vue2/transfomer';

function compileVue() {
  return {
    name: 'my-vue2',
    async transform(sourceCode: string, filename: string) {
      if (!filename.endsWith('.vue')) return;
      const { code } = await Vue2Transfomer.process(sourceCode, filename);
      return {
        code,
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue(),
    compileVue(),
  ],
})

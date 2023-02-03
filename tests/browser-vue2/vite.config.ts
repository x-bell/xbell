import { defineConfig } from 'vite'
import { Vue2Transfomer } from '@xbell/vue2/transfomer';

function compileVue() {
  return {
    name: 'my-vue2',
    async transform(sourceCode: string, filename: string) {
      if (Vue2Transfomer.match.test(filename)) {
        const { code } = await Vue2Transfomer.transform(sourceCode, filename);
        return {
          code,
        }
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
});

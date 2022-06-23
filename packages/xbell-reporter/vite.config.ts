import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      assets: path.join(__dirname, 'src/assets'),
      components: path.join(__dirname, 'src/components'),
      context: path.join(__dirname, 'src/context'),
    },
  }
})

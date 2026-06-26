import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        episode1: './how-llms-work-under-hood.html',
      }
    },
    outDir: 'docs',
  },
})

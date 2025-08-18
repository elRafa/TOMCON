import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        privacy: './privacy.html',
        terms: './terms.html',
        refunds: './refunds.html'
      }
    }
  },
  server: {
    port: 8000
  },
  publicDir: 'images'
})

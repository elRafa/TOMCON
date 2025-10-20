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
      },
      output: {
        // Prevent duplicate chunks by using consistent naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Share common chunks more effectively
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('lucide')) {
              return 'vendor-lucide';
            }
            return 'vendor';
          }
          if (id.includes('guests.js')) {
            return 'guests';
          }
          if (id.includes('script.js')) {
            return 'main';
          }
        }
      }
    },
    // Optimize CSS
    cssCodeSplit: false,
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 8000
  },
  publicDir: false,
  // Optimize dependencies
  optimizeDeps: {
    include: ['lucide']
  }
})

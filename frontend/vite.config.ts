import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Fix WebSocket/HMR issues
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // Allow connections from any host (useful for local network testing)
    host: true,
  },
  build: {
    // Production optimizations
    target: 'es2020',
    // Ensure assets have content hash for cache busting
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Add content hash to chunk filenames for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return 'assets/[name]-[hash][extname]';
          }
          return `assets/[name]-[hash][extname]`;
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
})

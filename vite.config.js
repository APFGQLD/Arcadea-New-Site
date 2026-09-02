import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Use absolute paths for assets (Required for deep linking)
  plugins: [react()],
  build: {
    modulePreload: {
      // Vite statically discovers the React.lazy(() => import('./pages/StudioPage'))
      // call inside App.jsx (part of the eager entry chunk) and, by default,
      // injects a <link rel="modulepreload"> (and stylesheet link) for that
      // whole lazy chunk directly into the single shared index.html — meaning
      // every visitor downloads the multi-MB Studio bundle up front. Strip it
      // from preload lists; dynamic import() still fetches it fine on-demand
      // when someone actually navigates to /studio.
      resolveDependencies: (filename, deps) =>
        deps.filter((dep) => !dep.includes('sanity-studio-vendor') && !dep.includes('StudioPage')),
    },
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n': ['react-i18next', 'i18next'],
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/wp-api': {
        target: 'https://cms.arcadea.com.au/wp-json/wp/v2',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wp-api/, ''),
      }
    }
  }
})

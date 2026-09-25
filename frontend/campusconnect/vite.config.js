import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      global: 'window',
    },
    server: {
      port: 5173,
      proxy: {
        // Post service (API gateway removed — route directly)
        '/api/posts': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        // Everything else under /api → user-service
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/ws': {
          target: 'http://localhost:8081',
          ws: true,
        },
      },
    },
    build: {
      sourcemap: mode !== 'production',
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Ensure production preview binds to the host/port provided by the environment
  preview: {
    host: process.env.HOST === '0.0.0.0' ? '0.0.0.0' : true,
    port: Number(process.env.PORT) || 4173,
    // allow external host access when previewing on Render
    hostHeader: undefined as any
  },

  // Ensure built assets use root base path
  base: '/'
})

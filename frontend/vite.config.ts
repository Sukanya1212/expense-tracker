import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // LOCAL development only (keep it)
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  // REQUIRED FOR RENDER DEPLOYMENT
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [
      "expense-tracker-3f10.onrender.com"
    ]
  }
})

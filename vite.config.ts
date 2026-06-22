import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  envPrefix: ['VITE_', 'GOOGLE_', 'KAKAO_'],
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

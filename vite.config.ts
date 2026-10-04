import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the local Express + SQLite server
      // (see /server). Avoids dealing with CORS in dev.
      '/api': 'http://localhost:5000',
    },
  },
})

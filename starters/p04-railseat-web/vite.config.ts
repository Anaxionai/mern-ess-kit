import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Your API allows only the origin http://localhost:5173 (CORS, task 8).
    // If port 5173 is busy, stop with an error instead of moving to 5174.
    port: 5173,
    strictPort: true,
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // <--- CHANGED: Use 3000 to avoid conflict with Client (3000)
    proxy: {
      // Connects to your backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Allows displaying images served by backend
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
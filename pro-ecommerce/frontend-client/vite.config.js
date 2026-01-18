import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // <--- CHANGED: Use 3000 to avoid conflict with Client (3000)
        proxy: {
            // Connects to your backend
            '/api': {
                target: 'https://e-commerce-project-u1xz.onrender.com',
                changeOrigin: true,
            },
            // Allows displaying images served by backend
            '/uploads': {
                target: 'https://e-commerce-project-u1xz.onrender.com',
                changeOrigin: true,
            },
        },
    },
});
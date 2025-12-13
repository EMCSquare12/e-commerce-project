import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            // This proxies calls from localhost:3000/api/* to localhost:5000/api/*
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
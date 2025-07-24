// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:4000' },
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify('http://localhost:4000/api/v1'),
    },
  },
});

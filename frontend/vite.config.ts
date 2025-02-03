import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    open: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
    },
  },
  build: {
    outDir: '../static_dev/js',
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: false,
    emptyOutDir: false,
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/last-viewer/', build: { rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } } });

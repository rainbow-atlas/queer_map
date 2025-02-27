import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/queer_map/',
  plugins: [
    react(),
    svgr()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
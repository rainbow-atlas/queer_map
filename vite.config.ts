import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// Default keeps github.io project URL working locally; CI sets VITE_BASE_PATH=/ for queermap.at
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/queer_map/',
  plugins: [
    react(),
    svgr()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
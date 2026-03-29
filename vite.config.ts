import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// Default matches GitHub Pages project sites (/repo/). Override VITE_BASE_PATH=/ for root deploys.
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
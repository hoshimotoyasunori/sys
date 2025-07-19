import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'システム設計アシスタント',
        short_name: '設計アシスタント',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#2563eb',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@radix-ui/react-dialog': '@radix-ui/react-dialog',
      '@radix-ui/react-slot': '@radix-ui/react-slot',
      '@radix-ui/react-label': '@radix-ui/react-label',
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
    ],
    force: true,
  },
}); 
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
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
    force: true,
  },
  resolve: {
    alias: {
      '@radix-ui/react-dialog': '@radix-ui/react-dialog/dist/index.js',
      '@radix-ui/react-accordion': '@radix-ui/react-accordion/dist/index.js',
      '@radix-ui/react-checkbox': '@radix-ui/react-checkbox/dist/index.js',
      '@radix-ui/react-dropdown-menu': '@radix-ui/react-dropdown-menu/dist/index.js',
      '@radix-ui/react-label': '@radix-ui/react-label/dist/index.js',
      '@radix-ui/react-popover': '@radix-ui/react-popover/dist/index.js',
      '@radix-ui/react-progress': '@radix-ui/react-progress/dist/index.js',
      '@radix-ui/react-select': '@radix-ui/react-select/dist/index.js',
      '@radix-ui/react-slot': '@radix-ui/react-slot/dist/index.js',
      '@radix-ui/react-tabs': '@radix-ui/react-tabs/dist/index.js',
      '@radix-ui/react-tooltip': '@radix-ui/react-tooltip/dist/index.js',
    },
  },
}); 
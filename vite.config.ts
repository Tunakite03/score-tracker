import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react(),
      tailwindcss(),
      VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['icon.svg', 'vite.svg'],
         manifest: {
            id: '/',
            name: 'Score Tracker',
            short_name: 'Score Tracker',
            description: 'Track scores and manage game sessions',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            orientation: 'portrait',
            icons: [
               {
                  src: '/pwa-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
               },
               {
                  src: '/pwa-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
               },
               {
                  src: '/pwa-maskable-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'maskable',
               },
               {
                  src: '/pwa-maskable-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
               },
            ],
         },
         workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            runtimeCaching: [
               {
                  urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                  handler: 'CacheFirst',
                  options: {
                     cacheName: 'google-fonts-cache',
                     expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                     },
                     cacheableResponse: {
                        statuses: [0, 200],
                     },
                  },
               },
            ],
         },
         devOptions: {
            enabled: true,
            type: 'module',
         },
      }),
   ],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
   server: {
      allowedHosts: ['localhost', '1b58-171-234-12-82.ngrok-free.app'],
   },
});

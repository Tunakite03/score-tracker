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
         includeAssets: ['vite.svg', 'icon.svg'],
         manifest: {
            name: 'Score Tracker',
            short_name: 'Score Tracker',
            description: 'Track game scores across multiple rounds with offline support',
            theme_color: '#000000',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait-primary',
            start_url: '/',
            icons: [
               {
                  src: '/icon-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any maskable',
               },
               {
                  src: '/icon-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any maskable',
               },
            ],
         },
         workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
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
});

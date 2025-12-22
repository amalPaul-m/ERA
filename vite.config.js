import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ERA Residents Association',
        short_name: 'ERA Connect',
        description: 'ERA Residents Family Directory & Management',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/src/assets/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/src/assets/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})

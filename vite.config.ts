import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
          name: 'ShinyOfflineDatensynchr',
          short_name: 'ShinyOfflineDatensynchr',
          description: 'Shiny Offline Datensynchr',
          theme_color: '#000',
         
        },
    }),
  ],
});
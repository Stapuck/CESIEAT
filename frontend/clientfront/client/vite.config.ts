import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],
  base: '/client/',
  server: {
    host: '0.0.0.0', // Permet l'accès depuis l'extérieur du conteneur
    port: 5173,
    allowedHosts: ['all', 'client_frontend'], // Permet d'accepter toutes les connexions
    
    // Configuration modifiée pour résoudre les problèmes de WebSocket
    hmr: {
      // Configuration pour Hot Module Replacement
      protocol: 'ws',
      host: 'localhost',
      clientPort: 8080,     // Le port exposé par Nginx
      path: 'client/ws',       // Le chemin de base de l'application - sans slash au début
    },
    
    // Configuration de proxy pour les services backend
    proxy: {
      '/api': {
        target: 'http://gateway:8080',
        changeOrigin: true,
        ws: true,
      },
    },
    
    // Ces paramètres sont nécessaires pour une utilisation en conteneur
    watch: {
      usePolling: true, // Important pour les volumes Docker sur certains systèmes
    },
  },
})

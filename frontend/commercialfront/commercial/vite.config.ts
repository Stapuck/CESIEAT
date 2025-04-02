import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],

  base: '/commercial/',
  server: {
    allowedHosts: ['commercial_frontend', 'commercial-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'commercial_frontend', // Ajoutez cet hôte ici
    port: 5176, // Port par défaut de Vite
    

  },
})

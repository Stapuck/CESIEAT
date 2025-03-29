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
    allowedHosts: ['client_frontend', 'client-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'client_frontend', // Ajoutez cet hôte ici
    port: 5173, // Port par défaut de Vite
    
    

  },

})

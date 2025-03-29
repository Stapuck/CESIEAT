import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],

  base: '/livreur/',
  server: {
    allowedHosts: ['livreur_frontend', 'livreur-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'livreur_frontend', // Ajoutez cet hôte ici
    port: 5175, // Port par défaut de Vite
    

  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],

  base: '/technical/',
  server: {
    allowedHosts: ['technical_frontend', 'technical-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'technical_frontend', // Ajoutez cet hôte ici
    port: 5177, // Port par défaut de Vite
    

  },
  
})

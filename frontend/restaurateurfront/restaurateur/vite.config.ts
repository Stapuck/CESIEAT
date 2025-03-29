import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],
  base: '/restaurateur/',
  server: {
    allowedHosts: ['restaurateur_frontend', 'restaurateur-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'restaurateur_frontend', // Ajoutez cet hôte ici
    port: 5174, // Port par défaut de Vite
    

  },
})

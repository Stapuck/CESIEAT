import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react(),
  ],

  base: '/developer/',
  server: {
    allowedHosts: ['developer_frontend', 'developer-frontend', 'localhost', '0.0.0.0'], // Ajoutez cet hôte ici
    host: 'developer_frontend', // Ajoutez cet hôte ici
    port: 5176, // Port par défaut de Vite
    

  },
})

import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'
import { serveStatic } from '@hono/node-server/serve-static';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = '/app/uploads';

const app = new Hono()

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;

import componentRoute from './routes/componentRoute.js';

// Configuration CORS améliorée
app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'Content-Disposition'],
}));

// Retirer cette ligne car on ne l'utilise plus
// app.use('/downloads', serveStatic({ root: uploadsDir }));

// Ajouter une route spécifique pour les téléchargements
app.route('/api/downloads', componentRoute);

app.route('/api/components', componentRoute);

// Route test pour vérifier que l'API fonctionne
app.get('/', (c) => c.text('Component Service API is running'));


const ComposantDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Composant?retryWrites=true&w=majority', {
});

ComposantDbConnection.then( () => {
  console.log('connected to mongodb')
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Component Service is running on http://localhost:${info.port}`)
  })
})

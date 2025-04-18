import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'
import articleRoute from './routes/articleRoute.js';
import { showRoutes } from 'hono/dev'

const app = new Hono({strict : false})

app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const PORT = Number(process.env.PORT) || 3005;


app.route('/', articleRoute);
// app.route('/', articleRoute);

showRoutes(app, {
  verbose: true,
})

mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then( () => {
  console.log('connected to mongodb')
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Articles is running on http://localhost:${info.port}`)
  })
})

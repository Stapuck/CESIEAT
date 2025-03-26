import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

const app = new Hono()

dotenv.config();

const FRONTEND = process.env.FRONTEND as string;
const PORT = Number(process.env.PORT) || 3000;

import clientRoute from './routes/clientRoute.js';

// CORS configuration
app.use('*', cors({
  origin: [FRONTEND],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.route('/api/clients', clientRoute);

mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;')
.then( () => {
  console.log('connected to mongodb')
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
})

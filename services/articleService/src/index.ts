import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'
import articleRoute from './routes/articleRoute.js';

const app = new Hono()
app.use('/doc', cors())

const PORT = Number(process.env.PORT) || 3005;


app.route('/', articleRoute);
// app.route('/', articleRoute);

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

import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

const app = new Hono()

dotenv.config();


// const MONGO_URL = process.env.MONGO_URL as string;
// const FRONTEND1 = process.env.FRONTEND1 as string; //ts 
// const FRONTEND2 = process.env.FRONTEND2 as string; //js
// const FRONTEND3 = process.env.FRONTEND3 as string; //js
// const FRONTEND4 = process.env.FRONTEND4 as string; //js
// const FRONTEND5 = process.env.FRONTEND5 as string; //js
const PORT = Number(process.env.PORT) || 3005;

import articleRoute from './routes/articleRoute.js';

app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.route('/api/articles', articleRoute);

const ArticleDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Article?retryWrites=true&w=majority', {
});

// mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
ArticleDbConnection.then( () => {
  console.log('Connected to mongodb : CesiEat_Article database');

 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Articles is running on http://localhost:${info.port}`)
  })
})

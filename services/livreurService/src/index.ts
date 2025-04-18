import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

const app = new Hono()

dotenv.config();

// const MONGO_URL = process.env.MONGO_URL as string;
// const FRONTEND1 = process.env.FRONTEND1 as string; 
// const FRONTEND2 = process.env.FRONTEND2 as string;
// const FRONTEND3 = process.env.FRONTEND3 as string;
// const FRONTEND4 = process.env.FRONTEND4 as string;
// const FRONTEND5 = process.env.FRONTEND5 as string;
const PORT = Number(process.env.PORT) || 3004;

import livreurRoute from './routes/livreurRoute.js';



// app.use('*', cors({
//   origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4, FRONTEND5 ],
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));



app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.route('/api/livreurs', livreurRoute);

const LivreurDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Livreur?retryWrites=true&w=majority', {
});

LivreurDbConnection.then( () => {
  console.log('Connected to mongodb : CesiEat_Livreur database');
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Livreur is running on http://localhost:${info.port}`)
  })
})

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
const PORT = Number(process.env.PORT) || 3003;

// const PORT = 8080;


import commandeRoute from './routes/commandeRoute.js';



// app.use('*', cors({
//   origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4, FRONTEND5 ],
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));





app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.route('/api/commandes', commandeRoute);


const CommandeDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Commande?retryWrites=true&w=majority', {
});

CommandeDbConnection.then( () => {
  console.log('Connected to mongodb : CesiEat_Commande database');
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Commande is running on http://localhost:${info.port}`)
  })
})

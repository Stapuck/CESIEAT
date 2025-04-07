// import { serve } from '@hono/node-server'
// import { Hono } from 'hono'

// const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

// serve({
//   fetch: app.fetch,
//   port: 3000
// }, (info) => {
//   console.log(`Server is running on http://localhost:${info.port}`)
// })

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
const PORT = Number(process.env.PORT) || 3007;



import commentaireRoute from './Routes/commentaireRoute.js';



// app.use('*', cors({
//   origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4, FRONTEND5 ],
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));





app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.route('/api/commentaires', commentaireRoute);


const CommentaireDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Commentaire?retryWrites=true&w=majority', {
});

CommentaireDbConnection.then( () => {
  console.log('Connected to mongodb : CesiEat_Commentaire database');
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Commande is running on http://localhost:${info.port}`)
  })
})

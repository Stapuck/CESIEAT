import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

const app = new Hono()

dotenv.config();

const PORT = Number(process.env.PORT) || 3007;



import commentaireRoute from './Routes/commentaireRoute.js';



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

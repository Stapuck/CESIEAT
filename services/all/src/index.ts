import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

import { errorMiddleware } from './middlewares/errorMiddleware.js';


const app = new Hono()

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;
const FRONTEND1 = process.env.FRONTEND1 as string; //ts 
const FRONTEND2 = process.env.FRONTEND2 as string; //js
const FRONTEND3 = process.env.FRONTEND3 as string; //js
const FRONTEND4 = process.env.FRONTEND4 as string; //js
const FRONTEND5 = process.env.FRONTEND5 as string; //js
const PORT = Number(process.env.PORT) || 3002;




// import route. 
import productRoute from './routes/productRoute.js';
import taskRoute from './routes/taskRoute.js';
import clientRoute from './routes/clientRoute.js';
import commandeRoute from './routes/commandeRoute.js';
// import errorMiddleware from './middlewares/errorMiddleware';



// CORS configuration
app.use('*', cors({
  origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4, FRONTEND5 ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Routes
app.route('/api/products', productRoute);
app.route('/api/tasks', taskRoute);
app.route('/api/clients', clientRoute)
app.route('/api/commandes', commandeRoute)







app.use(errorMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})



mongoose.connect(MONGO_URL)
.then( () => {
  console.log('connected to mongodb')
 
  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
})
import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mongoose from 'mongoose'

import { errorMiddleware } from './middlewares/errorMiddleware.js';


// import route. 
import productRoute from './routes/productRoute.js';
import taskRoute from './routes/taskRoute.js';
import clientRoute from './routes/clientRoute.js';
import commandeRoute from './routes/commandeRoute.js';
// import errorMiddleware from './middlewares/errorMiddleware';

dotenv.config();



const MONGO_URL = process.env.MONGO_URL as string;
const FRONTEND1 = process.env.FRONTEND1 as string; //ts 
const FRONTEND2 = process.env.FRONTEND2 as string; //js
const FRONTEND3 = process.env.FRONTEND2 as string; //js
const FRONTEND4 = process.env.FRONTEND4 as string; //js
const PORT = Number(process.env.PORT) || 3002;
// const PORT = 3002;


const app = new Hono()

// CORS configuration
app.use('*', cors({
  origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4 ],
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




// import { Hono } from 'hono';
// import { cors } from 'hono/cors';
// import { config } from 'dotenv';
// import mongoose from 'mongoose';


// import { errorMiddleware } from './middlewares/errormiddleware.js';

// config();


// import productRoute from './routes/productRoute.js';
// // import taskRoute from './routes/taskRoute';
// // import errorMiddleware from './middlewares/errorMiddleware';


// const app = new Hono();

// // // Middleware d'erreur
// // app.onError((err, c) => {
// //   return errorMiddleware(c, async () => { throw err; }) ?? c.text('An unknown error occurred', 500);
// // });

// // type CustomContext = Parameters<typeof errorMiddleware>[0];
// // app.onError((err, c: CustomContext) => errorMiddleware(c, async () => { throw err; }));

// app.use(errorMiddleware)

// const MONGO_URL = process.env.MONGO_URL as string;
// const PORT = process.env.PORT || 4400;
// const FRONTEND = process.env.FRONTEND as string;

// // CORS configuration
// app.use('*', cors({
//   origin: FRONTEND,
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// // Middleware for JSON handling
// app.use('*', async (c, next) => {
//   c.req.json = async () => JSON.parse(await c.req.text());
//   await next();
// });



// // Routes
// app.route('/api/products', productRoute);
// // app.route('/api/tasks', taskRoute);

// app.get('/', (c) => c.text('Hello World!'));

// // app.onError((err, c) => errorMiddleware(err, c));

// // Database connection & server start
// mongoose.connect(MONGO_URL)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     console.log(`Server is running on port ${PORT}`);
//     console.log(`Server is running on http://localhost:${PORT}`)
//   })
//   .catch((error) => {
//     console.error('Database connection error:', error);
//   });

// export default app;

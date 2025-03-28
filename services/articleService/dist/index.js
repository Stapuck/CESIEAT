import dotenv from 'dotenv';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';
const app = new Hono();
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND1 = process.env.FRONTEND1; //ts 
const FRONTEND2 = process.env.FRONTEND2; //js
const FRONTEND3 = process.env.FRONTEND3; //js
const FRONTEND4 = process.env.FRONTEND4; //js
const FRONTEND5 = process.env.FRONTEND5; //js
const PORT = Number(process.env.PORT) || 3000;
import articleRoute from './routes/articleRoute.js';
// CORS configuration
app.use('*', cors({
    origin: [FRONTEND1, FRONTEND2, FRONTEND3, FRONTEND4, FRONTEND5],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.route('/api/articles', articleRoute);
mongoose.connect(MONGO_URL)
    .then(() => {
    console.log('connected to mongodb');
    serve({
        fetch: app.fetch,
        port: PORT
    }, (info) => {
        console.log(`Server Articles is running on http://localhost:${info.port}`);
    });
});

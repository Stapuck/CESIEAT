import { Hono } from 'hono';
import {getLivreurs, getLivreur, createLivreur, editLivreur, deleteLivreur, getAvailableLivreurs } from '../controllers/livreurController.js'


const livreurRoute = new Hono();

livreurRoute.get('/', getLivreurs);
livreurRoute.get('/:id', getLivreur);
livreurRoute.post('/', createLivreur);
livreurRoute.put('/:id', editLivreur);
livreurRoute.delete('/:id', deleteLivreur);
livreurRoute.get('/livreurs/available', getAvailableLivreurs);

// app.get('/livreurs/availability', getLivreursByAvailability);



export default livreurRoute;
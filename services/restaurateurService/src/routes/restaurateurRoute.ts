import { Hono } from 'hono';
import {getRestaurateurs, getRestaurateur, createRestaurant, editRestaurant, deleteRestaurant, getRestaurateurByManagerId } from '../controllers/restaurateurController.js'


const restaurantRoute = new Hono();

restaurantRoute.get('/', getRestaurateurs);
restaurantRoute.get('/:id', getRestaurateur);
restaurantRoute.post('/', createRestaurant);
restaurantRoute.put('/:id', editRestaurant);
restaurantRoute.delete('/:id', deleteRestaurant);
restaurantRoute.get('/manager/:managerid', getRestaurateurByManagerId);



export default restaurantRoute;
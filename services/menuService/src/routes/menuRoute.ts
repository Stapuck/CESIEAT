import { Hono } from 'hono';
import {getMenus, getMenu, createMenu, editMenu, deleteMenu, getMenuByRestaurantBody, getMenusByRestorateur} from '../controllers/menuController.js';

const menuRoute = new Hono();

menuRoute.get('/', getMenus);
menuRoute.get('/:id', getMenu);
menuRoute.post('/', createMenu);
menuRoute.put('/:id', editMenu);
menuRoute.delete('/:id', deleteMenu);
menuRoute.get('/restaurant/:id');
menuRoute.post('/restaurant', getMenuByRestaurantBody);
menuRoute.get('/restaurateur/:restaurateurId', getMenusByRestorateur);

export default menuRoute;
import { Hono } from 'hono';
import {getMenus, getMenu, createMenu, editMenu, deleteMenu, getMenuByRestaurantBody} from '../controllers/menuController.js';

const clientRoute = new Hono();

clientRoute.get('/', getMenus);
clientRoute.get('/:id', getMenu);
clientRoute.post('/', createMenu);
clientRoute.put('/:id', editMenu);
clientRoute.delete('/:id', deleteMenu);
clientRoute.get('/restaurant/:id');
clientRoute.post('/restaurant', getMenuByRestaurantBody);

export default clientRoute;
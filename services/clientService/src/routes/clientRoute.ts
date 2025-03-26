import { Hono } from 'hono';
import {getClients, getClient, createClient, editClient, deleteClient} from '../controllers/clientController.js'


const productRoute = new Hono();

productRoute.get('/', getClients);
productRoute.get('/:id', getClient);
productRoute.post('/', createClient);
productRoute.put('/:id', editClient);
productRoute.delete('/:id', deleteClient);

export default productRoute;
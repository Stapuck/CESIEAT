import { Hono } from 'hono';
import {getClients, getClient, createClient, editClient, deleteClient} from '../controllers/clientController.js'


const clientRoute = new Hono();

clientRoute.get('/', getClients);
clientRoute.get('/:id', getClient);
clientRoute.post('/', createClient);
clientRoute.put('/:id', editClient);
clientRoute.delete('/:id', deleteClient);

export default clientRoute;
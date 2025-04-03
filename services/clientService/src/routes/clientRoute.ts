import { Hono } from 'hono';
import {
    getClients, 
    getClient, 
    createClient, 
    editClient, 
    deleteClient, 
    pauseClient, 
    getClientByZitadelId,
    editClientByZitadelId,
    deleteClientByZitadelId
} from '../controllers/clientController.js'


const clientRoute = new Hono();

clientRoute.get('/', getClients);
clientRoute.get('/byZitadelId/:zitadelId', getClientByZitadelId);
clientRoute.put('/byZitadelId/:zitadelId', editClientByZitadelId);
clientRoute.delete('/byZitadelId/:zitadelId', deleteClientByZitadelId);
clientRoute.get('/:id', getClient);
clientRoute.post('/', createClient);
clientRoute.put('/:id', editClient);
clientRoute.delete('/:id', deleteClient);
clientRoute.put('/clients/:id/pause', pauseClient);

export default clientRoute;
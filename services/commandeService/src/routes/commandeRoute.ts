import { Hono } from 'hono';
import {getCommandes, getCommande, createCommande, editCommande, deleteCommande, getCommandesByRestorateur, getCommandesByClient } from '../controllers/commandeController.js'


const commandeRoute = new Hono();

commandeRoute.get('/client/:clientId_Zitadel', getCommandesByClient )
commandeRoute.get('/restaurateur/:idrestaurateur', getCommandesByRestorateur )
commandeRoute.get('/', getCommandes);
commandeRoute.get('/:id', getCommande);
commandeRoute.post('/', createCommande);
commandeRoute.put('/:id', editCommande);
commandeRoute.delete('/:id', deleteCommande);



export default commandeRoute;
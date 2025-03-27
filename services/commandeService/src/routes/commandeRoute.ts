import { Hono } from 'hono';
import {getCommandes, getCommande, createCommande, editCommande, deleteCommande, getCommandesByRestorateur, getCommandesByClient } from '../controllers/commandeController.js'


const commandeRoute = new Hono();

commandeRoute.get('/', getCommandes);
commandeRoute.get('/:id', getCommande);
commandeRoute.post('/', createCommande);
commandeRoute.put('/:id', editCommande);
commandeRoute.delete('/:id', deleteCommande);
commandeRoute.get('/client/:idclient', getCommandesByRestorateur )
commandeRoute.get('/restaurateur/:idrestaurateur', getCommandesByClient )


export default commandeRoute;
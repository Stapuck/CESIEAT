import { Hono } from 'hono';
import { 
    getCommandes, 
    getCommande, 
    createCommande, 
    editCommande, 
    deleteCommande, 
    getCommandesByRestorateur, 
    getCommandesByClient,
    getCommandesByLivreur,
    assignCommandeToLivreur,
    markCommandeAsDelivered,
    getCommandesAvailableForDelivery
} from '../controllers/commandeController.js';

const commandeRoute = new Hono();

// Routes existantes
commandeRoute.get('/client/:clientId_Zitadel', getCommandesByClient);
commandeRoute.get('/restaurateur/:restaurantId', getCommandesByRestorateur);
commandeRoute.get('/', getCommandes);
commandeRoute.get('/:id', getCommande);
commandeRoute.post('/', createCommande);
commandeRoute.put('/:id', editCommande);
commandeRoute.delete('/:id', deleteCommande);

// Nouvelles routes pour les livreurs
commandeRoute.get('/livreur/:livreurId_Zitadel', getCommandesByLivreur);
commandeRoute.get('/disponibles', getCommandesAvailableForDelivery);
commandeRoute.put('/:id/:livreurId_Zitadel/assign', assignCommandeToLivreur);
commandeRoute.put('/:id/deliver', markCommandeAsDelivered);

export default commandeRoute;
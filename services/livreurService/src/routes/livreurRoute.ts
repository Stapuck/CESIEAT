import { Hono } from 'hono';
import {
    getLivreurs, 
    getLivreur, 
    createLivreur, 
    editLivreur, 
    deleteLivreur, 
    getAvailableLivreurs, 
    getLivreurByCodeLivreur,
    getLivreurByZitadelId,   // Nouvelle fonction importée
    updateLivreurByZitadelId // Nouvelle fonction importée
} from '../controllers/livreurController.js'


const livreurRoute = new Hono();

livreurRoute.get('/', getLivreurs);
livreurRoute.get('/:id', getLivreur);
livreurRoute.get('/codelivreur/:codelivreur', getLivreurByCodeLivreur);
livreurRoute.get('/byZitadelId/:zitadelId', getLivreurByZitadelId);        // Nouvelle route
livreurRoute.put('/byZitadelId/:zitadelId', updateLivreurByZitadelId);     // Nouvelle route
livreurRoute.post('/', createLivreur);
livreurRoute.put('/:id', editLivreur);
livreurRoute.delete('/:id', deleteLivreur);
livreurRoute.get('/livreurs/available', getAvailableLivreurs);

export default livreurRoute;
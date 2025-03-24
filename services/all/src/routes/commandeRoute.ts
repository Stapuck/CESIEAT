import { createRoute } from './genericRoutes.js';
import Commande from '../models/commandeModel.js'
import {getCommandesByClient, getCommandesByRestorateur } from '../controllers/commandeController.js'


const commandeRoute = createRoute(Commande);


//custom
commandeRoute.get('/client/:idclient', getCommandesByRestorateur )
commandeRoute.get('/restaurateur/:idrestaurateur', getCommandesByClient )


export default commandeRoute;
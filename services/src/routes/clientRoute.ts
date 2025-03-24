import { createRoute } from './genericRoutes.js';
import Client from '../models/clientModel.js'
import {} from '../controllers/commandeController.js'


const clientRoute = createRoute(Client);


//custom 

clientRoute.get('/custom/1', async (c) =>{
    return c.json({message: 'route custom'});
})



// export default {clientRoute , clientRoute1};
export default clientRoute;
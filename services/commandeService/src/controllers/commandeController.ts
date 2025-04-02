import type { Context } from 'hono';
import { Commande } from '../models/commandeModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getCommandes = async (c: Context) => {
    try {
        const commandes = await Commande.find({});
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getCommande = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const commande = await Commande.findById(id);
        if (!commande) return c.json({ message: `Commande with ID ${id} not found` }, 404);
        return c.json(commande);
    } catch (error) {
        return handleError(error, c);
    }
};

export const createCommande = async (c: Context) => {
    try {
        const body = await c.req.json();
        const commande = await Commande.create(body);
        return c.json(commande, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

export const editCommande = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const commande = await Commande.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!commande) return c.json({ message: `Commande with ID ${id} not found` }, 404);
        return c.json(commande);
    } catch (error) {
        return handleError(error, c);
    }
};

export const deleteCommande = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const commande = await Commande.findByIdAndDelete(id);
        if (!commande) return c.json({ message: `Commande with ID ${id} not found` }, 404);
        return c.json({ message: `Commande ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};


// export const getCommandesByRestorateur = async (c: Context) => {
//     try {
//         const restorateurId = c.req.param('restorateurId');
//         const commandes = await Commande.find({ restaurant : restorateurId });
//         if (commandes.length === 0) return c.json({ message: 'No orders found for this restorateur' }, 404);
//         return c.json(commandes);
//     } catch (error) {
//         return handleError(error, c);
//     }
// };


export const getCommandesByRestorateur = async (c: Context) => {
    try {
        // Utiliser "restaurateurId" pour récupérer le paramètre de la route
        const restaurateurId = c.req.param('idrestaurateur');

        // Vérification si le restaurateurId est bien fourni
        if (!restaurateurId) {
            return c.json({ message: "Restaurateur ID is required" }, 400);
        }

        // Recherche des commandes associées au restaurateur (restaurant)
        const commandes = await Commande.find({ restaurateurId: restaurateurId });

        // Si aucune commande n'est trouvée pour ce restaurateur
        if (commandes.length === 0) {
            return c.json({ message: `No orders found for restaurateur ${restaurateurId}` }, 404);
        }

        // Si des commandes sont trouvées, les renvoyer
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};


export const getCommandesByClient = async (c: Context) => {
    try {
        const clientId_Zitadel = c.req.param('clientId_Zitadel');
        
        if (!clientId_Zitadel) {
            return c.json({ message: "Client ID is required" }, 400);
        }
        
        const commandes = await Commande.find({ clientId_Zitadel: clientId_Zitadel });
        
        if (commandes.length === 0) {
            return c.json({ message: `No orders found for client ${clientId_Zitadel}` }, 404);
        }
        
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};

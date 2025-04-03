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

// Obtenir toutes les commandes assignées à un livreur spécifique
export const getCommandesByLivreur = async (c: Context) => {
    try {
        const livreurId_Zitadel = c.req.param('livreurId_Zitadel');
        
        if (!livreurId_Zitadel) {
            return c.json({ message: "Livreur ID is required" }, 400);
        }
        
        const commandes = await Commande.find({ 
            livreurId_Zitadel: livreurId_Zitadel,
            status: { $in: ["En livraison", "Prêt"] }
        });
        
        if (commandes.length === 0) {
            return c.json([]);
        }
        
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};

// Assigner un livreur à une commande spécifique
export const assignCommandeToLivreur = async (c: Context) => {
    try {
        const commandeId = c.req.param('id');
        const body = await c.req.json();
        
        if (!body.livreurId_Zitadel) {
            return c.json({ message: "Livreur ID is required" }, 400);
        }
        
        
        // Vérifier d'abord si la commande existe
        const existingCommande = await Commande.findById(commandeId);
        if (!existingCommande) {
            return c.json({ message: `Commande with ID ${commandeId} not found` }, 404);
        }
        
        // Vérifier si la commande est déjà assignée à un livreur
        if (existingCommande.livreurId_Zitadel && existingCommande.livreurId_Zitadel !== body.livreurId_Zitadel) {
            return c.json({ 
                message: `Cette commande est déjà assignée au livreur ${existingCommande.livreurId_Zitadel}` 
            }, 400);
        }
        
        // Vérifier si la commande est dans un état qui permet de l'assigner
        if (existingCommande.status !== "Prêt" && existingCommande.status !== "En attente") {
            return c.json({ 
                message: `Impossible d'assigner cette commande. Statut actuel: ${existingCommande.status}` 
            }, 400);
        }
        
        // Mettre à jour la commande
        const commande = await Commande.findByIdAndUpdate(
            commandeId, 
            { 
                livreurId_Zitadel: body.livreurId_Zitadel,
            }, 
            { new: true, runValidators: true }
        );
        
        return c.json(commande);
    } catch (error) {
        return handleError(error, c);
    }
};

// Marquer une commande comme livrée
export const markCommandeAsDelivered = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        
        if (!body.livreurId_Zitadel) {
            return c.json({ message: "Livreur ID is required" }, 400);
        }
        
        // Vérifier si la commande existe
        const existingCommande = await Commande.findById(id);
        if (!existingCommande) {
            return c.json({ message: `Commande with ID ${id} not found` }, 404);
        }
        
        // Vérifier si la commande est assignée au livreur qui fait la requête
        if (existingCommande.livreurId_Zitadel !== body.livreurId_Zitadel) {
            return c.json({ 
                message: `Vous n'êtes pas autorisé à modifier cette commande` 
            }, 403);
        }
        
        // Vérifier si la commande est en cours de livraison
        if (existingCommande.status !== "En livraison") {
            return c.json({ 
                message: `Impossible de marquer cette commande comme livrée. Statut actuel: ${existingCommande.status}` 
            }, 400);
        }
        
        // Mettre à jour la commande
        const commande = await Commande.findByIdAndUpdate(
            id, 
            { status: "Livrée" }, 
            { new: true, runValidators: true }
        );
        
        return c.json(commande);
    } catch (error) {
        return handleError(error, c);
    }
};

// Obtenir les commandes disponibles pour les livreurs (statut "Prêt")
export const getCommandesAvailableForDelivery = async (c: Context) => {
    try {
        const commandes = await Commande.find({ 
            status: "Prêt",
            livreurId_Zitadel: { $exists: false }
        });
        
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};
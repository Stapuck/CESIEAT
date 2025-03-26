import type { Context } from 'hono';
import Commande from '../models/commandeModel.js';
import {getAll, getById, createItem, updateItem, deleteItem, handleError} from './genericController.js'

export const getCommandes = (c: Context) => getAll(Commande, c);
export const getCommande = (c: Context) => getById(Commande, c);
export const createCommande = (c: Context) => createItem(Commande, c);
export const updateCommande = (c: Context) => updateItem(Commande, c);
export const deleteCommande = (c: Context) => deleteItem(Commande, c);

//custom

export const getCommandesByRestorateur = async (c: Context) => {
    try {
        const restorateurId = c.req.param('restorateurId');
        const commandes = await Commande.find({ restorateurId });
        if (commandes.length === 0) return c.json({ message: 'No orders found for this restorateur' }, 404);
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getCommandesByClient = async (c: Context) => {
    try {
        const clientId = c.req.param('clientId');
        const commandes = await Commande.find({ clientId });
        if (commandes.length === 0) return c.json({ message: 'No orders found for this client' }, 404);
        return c.json(commandes);
    } catch (error) {
        return handleError(error, c);
    }
};
import type { Context } from 'hono';
import Commande from '../models/commandeModel.js';

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

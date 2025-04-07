import type { Context } from 'hono';
import Commentaire from '../Models/commentaireModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getCommentaires = async (c: Context) => {
    try {
        const commentaires = await Commentaire.find({});
        return c.json(commentaires);
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer un commentaire par ID
export const getCommentaire = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const commentaire = await Commentaire.findById(id);
        if (!commentaire) return c.json({ message: `Commentaire with ID ${id} not found` }, 404);
        return c.json(commentaire);
    } catch (error) {
        return handleError(error, c);
    }
};

// Créer un nouveau commentaire
export const createCommentaire = async (c: Context) => {
    try {
        const body = await c.req.json();
        const commentaire = await Commentaire.create(body);
        return c.json(commentaire, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

// Modifier un commentaire existant
export const editCommentaire = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const commentaire = await Commentaire.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!commentaire) return c.json({ message: `Commentaire with ID ${id} not found` }, 404);
        return c.json(commentaire);
    } catch (error) {
        return handleError(error, c);
    }
};

// Supprimer un commentaire
export const deleteCommentaire = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const commentaire = await Commentaire.findByIdAndDelete(id);
        if (!commentaire) return c.json({ message: `Commentaire with ID ${id} not found` }, 404);
        return c.json({ message: `Commentaire ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer tous les commentaires d’un client spécifique
export const getCommentairesByClient = async (c: Context) => {
    try {
        const clientId = c.req.param('clientId');
        if (!clientId) return c.json({ message: "Client ID is required" }, 400);
        const commentaires = await Commentaire.find({ clientId: clientId });
        return c.json(commentaires);
    } catch (error) {
        return handleError(error, c);
    }
};

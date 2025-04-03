import type { Context } from 'hono';
import Menu from '../models/menuModel.js'; // Assurez-vous d'importer le modèle Menu
import { Hono } from 'hono';
import mongoose from 'mongoose';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getMenus = async (c: Context) => {
    try {
        const menus = await Menu.find({});
        return c.json(menus);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const menu = await Menu.findById(id);
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json(menu);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const createMenu = async (c: Context) => {
    try {
        const body = await c.req.json();
        const menu = await Menu.create(body);
        return c.json(menu, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const editMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const menu = await Menu.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json(menu);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const deleteMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const menu = await Menu.findByIdAndDelete(id);
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json({ message: `Menu ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getMenuByRestaurantBody = async (c: Context) => {
    try {
        console.log("Début du contrôleur getMenuByRestaurantBody");
        console.log("URL complète:", c.req.url);
        console.log("Paramètres:", c.req.param());
        
        const restaurateurId = c.req.param('id');
        console.log("Reçu restaurateurId:", restaurateurId);

        if (!restaurateurId) {
            console.error("Erreur: Aucun restaurateurId fourni.");
            return c.json({ message: "L'ID du restaurateur est requis." }, 400);
        }

        if (!/^[0-9a-fA-F]{24}$/.test(restaurateurId)) {
            console.error("Erreur: ID de restaurateur invalide:", restaurateurId);
            return c.json({ message: "ID de restaurateur invalide." }, 400);
        }

        console.log("Recherche des menus pour le restaurateur ID:", restaurateurId);
        
        // Données de test pour vérifier si le problème vient de MongoDB
        const testData = [
            {
                name: "Menu Test",
                price: 10.99,
                articles: [],
                restaurateurId: restaurateurId,
                url_image: "http://example.com/image.jpg"
            }
        ];
        
        // Commentez cette ligne pour utiliser les données de test
        // const menus = await Menu.find({
        //     $or: [
        //         { restaurateur: restaurateurId },
        //         { 'restaurateur.0': restaurateurId }
        //     ]
        // });
        
        // Utilisez ces données de test pour vérifier si la route fonctionne
        const menus = testData;
        
        console.log("Résultat de la requête:", menus);

        if (!menus || menus.length === 0) {
            console.warn("Aucun menu trouvé pour le restaurateur ID:", restaurateurId);
            return c.json({ message: "Aucun menu trouvé pour ce restaurateur." }, 404);
        }

        console.log("Menus trouvés:", menus);
        return c.json(menus, 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des menus par restaurateur:", error);
        return handleError(error, c);
    }
};

export const getMenusByRestaurateurQuery = async (c: Context) => {
    try {
        // Utiliser le paramètre de requête 'id'
        const restaurateurId = c.req.query('id');
        console.log("Requête reçue avec paramètre de requête id:", restaurateurId);
        
        if (!restaurateurId) {
            console.error("Erreur: Aucun ID de restaurateur fourni.");
            return c.json({ message: "L'ID du restaurateur est requis." }, 400);
        }

        if (!mongoose.Types.ObjectId.isValid(restaurateurId)) {
            console.error("Erreur: ID de restaurateur invalide:", restaurateurId);
            return c.json({ 
                message: "Format d'ID de restaurateur invalide.", 
                details: "L'ID doit être un ObjectId MongoDB valide (24 caractères hexadécimaux)."
            }, 400);
        }

        console.log("Recherche des menus pour le restaurateur ID:", restaurateurId);
        
        try {
            const menus = await Menu.find({ restaurateur: restaurateurId });
            console.log(`Trouvé ${menus.length} menus pour le restaurateur ${restaurateurId}:`, menus);
            return c.json(menus || [], 200);
        } catch (dbError) {
            console.error("Erreur MongoDB:", dbError);
            return c.json({ message: "Erreur lors de la recherche dans MongoDB" }, 500);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des menus:", error);
        return handleError(error, c);
    }
};


export const getMenusByRestorateur = async (c: Context) => {
    try {
        const restaurateurId = c.req.param('restaurateurid');

        // Vérification si le restaurateurid est valide (en tant que chaîne de caractères)
        if (!restaurateurId) {
            return c.json({ message: "Restaurateur ID is required" }, 400);
        }

        // Recherche des menus associés au restaurateurid (en tant que String)
        const menus = await Menu.find({ restaurateurId: restaurateurId });

        if (menus.length === 0) {
            return c.json({ message: `No menus found for restaurateur ${restaurateurId}` }, 404);
        }

        return c.json(menus);
    } catch (error) {
        return handleError(error, c);
    }
};








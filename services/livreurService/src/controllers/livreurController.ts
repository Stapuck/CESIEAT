import type { Context } from 'hono';
import Livreur from '../models/livreurModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getLivreurs = async (c: Context) => {
    try {
        const livreurs = await Livreur.find({});
        return c.json(livreurs);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getLivreur = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const livreur = await Livreur.findById(id);
        if (!livreur) return c.json({ message: `Livreur with ID ${id} not found` }, 404);
        return c.json(livreur);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getLivreurByCodeLivreur = async (c: Context) => {
    try {
        const codelivreur = c.req.param('codelivreur');  // Récupérer le code du livreur

        const livreur = await Livreur.findOne({ codeLivreur: codelivreur });

        if (!livreur) {
            return c.json({ message: `Livreur avec le code ${codelivreur} non trouvé` }, 404);
        }

        return c.json(livreur);
    } catch (error) {
        return handleError(error, c);
    }
};

export const createLivreur = async (c: Context) => {
    try {
        const body = await c.req.json();
        const livreur = await Livreur.create(body);
        return c.json(livreur, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

export const editLivreur = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const livreur = await Livreur.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!livreur) return c.json({ message: `Livreur with ID ${id} not found` }, 404);
        return c.json(livreur);
    } catch (error) {
        return handleError(error, c);
    }
};

export const deleteLivreur = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const livreur = await Livreur.findByIdAndDelete(id);
        if (!livreur) return c.json({ message: `Livreur with ID ${id} not found` }, 404);
        return c.json({ message: `Livreur ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};

export const getAvailableLivreurs = async (c: Context) => {
    try {
        const livreurs = await Livreur.find({ isAvailable: true });
        return c.json(livreurs);
    } catch (error) {
        return handleError(error, c);
    }
};



// test 
// export const getLivreursByAvailability = async (c: Context) => {
//     try {
//         const isAvailable = c.req.query('isAvailable'); // Récupère le paramètre de la requête
//         if (isAvailable !== 'true' && isAvailable !== 'false') {
//             return c.json({ message: 'Invalid isAvailable value. Use "true" or "false".' }, 400);
//         }

//         const livreurs = await Livreur.find({ isAvailable: isAvailable === 'true' });
//         return c.json(livreurs);
//     } catch (error) {
//         return handleError(error, c);
//     }
// };



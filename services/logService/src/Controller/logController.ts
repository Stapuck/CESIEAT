import type { Context } from 'hono';
import Log from '../Model/logModel.js';

// Fonction générique de gestion des erreurs
const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

// Récupérer tous les logs
export const getLogs = async (c: Context) => {
    try {
        const logs = await Log.find({});
        return c.json(logs);
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer un log spécifique par son ID
export const getLog = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const log = await Log.findById(id);
        if (!log) return c.json({ message: `Log with ID ${id} not found` }, 404);
        return c.json(log);
    } catch (error) {
        return handleError(error, c);
    }
};

// Créer un nouveau log
export const createLog = async (c: Context) => {
    try {
        const body = await c.req.json();
        const log = await Log.create(body);
        return c.json(log, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

// Modifier un log existant
export const editLog = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const log = await Log.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!log) return c.json({ message: `Log with ID ${id} not found` }, 404);
        return c.json(log);
    } catch (error) {
        return handleError(error, c);
    }
};

// Supprimer un log
export const deleteLog = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const log = await Log.findByIdAndDelete(id);
        if (!log) return c.json({ message: `Log with ID ${id} not found` }, 404);
        return c.json({ message: `Log ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer les logs par utilisateur (par exemple, ID utilisateur)
export const getLogsByUserId = async (c: Context) => {
    try {
        const userId = c.req.param('userId');
        const logs = await Log.find({ userId });
        if (logs.length === 0) {
            return c.json({ message: `No logs found for user ID ${userId}` }, 404);
        }
        return c.json(logs);
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer les logs par type d'événement (par exemple : "login", "error", etc.)
export const getLogsByEventType = async (c: Context) => {
    try {
        const eventType = c.req.param('eventType');
        const logs = await Log.find({ eventType });
        if (logs.length === 0) {
            return c.json({ message: `No logs found for event type ${eventType}` }, 404);
        }
        return c.json(logs);
    } catch (error) {
        return handleError(error, c);
    }
};

// Récupérer les logs dans un intervalle de dates donné
// export const getLogsByDateRange = async (c: Context) => {
//     try {
//         const startDate = new Date(c.req.query('startDate'));
//         const endDate = new Date(c.req.query('endDate'));
//         if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//             return c.json({ message: 'Invalid date range' }, 400);
//         }

//         const logs = await Log.find({
//             createdAt: { $gte: startDate, $lte: endDate }
//         });
//         if (logs.length === 0) {
//             return c.json({ message: `No logs found between ${startDate.toISOString()} and ${endDate.toISOString()}` }, 404);
//         }
//         return c.json(logs);
//     } catch (error) {
//         return handleError(error, c);
//     }
// };

// // Récupérer les logs d'erreurs
// export const getErrorLogs = async (c: Context) => {
//     try {
//         const logs = await Log.find({ logLevel: 'error' });
//         return c.json(logs);
//     } catch (error) {
//         return handleError(error, c);
//     }
// };

import { Hono } from 'hono';
import { 
    getLogs,
    getLog,
    createLog,
    editLog,
    deleteLog,
    getLogsByUserId,
    getLogsByEventType,
    // getLogsByDateRange,
    // getErrorLogs
} from '../Controller/logController.js';

const logRoute = new Hono();

// Récupérer tous les logs
logRoute.get('/', getLogs);

// Récupérer un log spécifique par son ID
logRoute.get('/:id', getLog);

// Créer un nouveau log
logRoute.post('/', createLog);

// Modifier un log existant
logRoute.put('/:id', editLog);

// Supprimer un log
logRoute.delete('/:id', deleteLog);

// Récupérer les logs d'un utilisateur spécifique par ID
logRoute.get('/user/:userId', getLogsByUserId);

// Récupérer les logs d'un type d'événement spécifique
logRoute.get('/event/:eventType', getLogsByEventType);

// Récupérer les logs dans une plage de dates spécifique
// logRoute.get('/date-range', getLogsByDateRange);

// // Récupérer uniquement les logs d'erreurs
// logRoute.get('/error', getErrorLogs);

export default logRoute;

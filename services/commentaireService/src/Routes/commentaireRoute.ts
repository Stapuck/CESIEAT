import { Hono } from 'hono';
import { 
    getCommentaires, 
    getCommentaire, 
    createCommentaire, 
    editCommentaire, 
    deleteCommentaire, 
    getCommentairesByClient 
} from '../Controllers/commentaireController.js';

const commentaireRoute = new Hono();

// Récupérer tous les commentaires
commentaireRoute.get('/', getCommentaires);

// Récupérer un commentaire par son ID
commentaireRoute.get('/:id', getCommentaire);

// Créer un nouveau commentaire
commentaireRoute.post('/', createCommentaire);

// Modifier un commentaire
commentaireRoute.put('/:id', editCommentaire);

// Supprimer un commentaire
commentaireRoute.delete('/:id', deleteCommentaire);

// Récupérer tous les commentaires d’un client spécifique
commentaireRoute.get('/client/:clientId', getCommentairesByClient);

export default commentaireRoute;

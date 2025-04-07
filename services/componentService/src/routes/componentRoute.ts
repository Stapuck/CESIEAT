import { Hono } from 'hono';
import { createComponent, deleteComponent, downloadFile, editComponent, getComponent, getComponents } from '../controllers/componentController.js';

const componentRoute = new Hono();

// Routes existantes
componentRoute.get('/', getComponents);
componentRoute.get('/:id', getComponent);
componentRoute.post('/', createComponent);
componentRoute.put('/:id', editComponent);
componentRoute.delete('/:id', deleteComponent);

// Nouvelle route pour les téléchargements
componentRoute.get('/download/:fileName', downloadFile);

export default componentRoute;
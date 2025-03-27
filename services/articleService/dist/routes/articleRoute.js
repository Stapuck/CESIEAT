import { Hono } from 'hono';
import { getArticles, getArticle, createArticle, editArticle, deleteArticle } from '../controllers/articleController.js';
const clientRoute = new Hono();
clientRoute.get('/', getArticles);
clientRoute.get('/:id', getArticle);
clientRoute.post('/', createArticle);
clientRoute.put('/:id', editArticle);
clientRoute.delete('/:id', deleteArticle);
export default clientRoute;

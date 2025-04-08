import { Hono } from 'hono';
import {getArticles, getArticle, createArticle, editArticle, deleteArticle, getArticlesByRestorateur} from '../controllers/articleController.js'


const articleRoute = new Hono();

articleRoute.get('/', getArticles);
articleRoute.get('/:id', getArticle);
articleRoute.post('/', createArticle);
articleRoute.put('/:id', editArticle);
articleRoute.delete('/:id', deleteArticle);
articleRoute.get('/restaurateur/:restaurateurId', getArticlesByRestorateur);

export default articleRoute;
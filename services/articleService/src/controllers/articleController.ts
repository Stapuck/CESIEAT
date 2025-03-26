import type { Context } from 'hono';
import Article from '../models/articleModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getArticles = async (c: Context) => {
    try {
        const articles = await Article.find({});
        return c.json(articles);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getArticle = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const article = await Article.findById(id);
        if (!article) return c.json({ message: `Article with ID ${id} not found` }, 404);
        return c.json(article);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const createArticle = async (c: Context) => {
    try {
        const body = await c.req.json();
        const client = await Article.create(body);
        return c.json(client, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const editArticle = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const article = await Article.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!article) return c.json({ message: `Article with ID ${id} not found` }, 404);
        return c.json(article);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const deleteArticle = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const client = await Article.findByIdAndDelete(id);
        if (!client) return c.json({ message: `Article with ID ${id} not found` }, 404);
        return c.json({ message: `Article ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};


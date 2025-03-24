import {Hono} from 'hono';
import type { Context } from 'hono';
import {getAll, getById, createItem, updateItem, deleteItem} from '../controllers/genericController.js'

export const createRoutetest = (Model: any, basePath: string) => {
    const route = new Hono();

    route.get(basePath, (c: Context) => getAll(Model, c));
    route.get(`${basePath}/:id`, (c: Context) => getById(Model, c));
    route.post(basePath, (c: Context) => createItem(Model, c));
    route.put(`${basePath}/:id`, (c: Context) => updateItem(Model, c));
    route.delete(`${basePath}/:id`, (c: Context) => deleteItem(Model, c));

    return route;
};

export const createRoute = (Model: any) => {
    const route = new Hono();

    route.get('/', (c: Context) => getAll(Model, c));
    route.get('/:id', (c: Context) => getById(Model, c));
    route.post('/', (c: Context) => createItem(Model, c));
    route.put('/:id', (c: Context) => updateItem(Model, c));
    route.delete('/:id', (c: Context) => deleteItem(Model, c));

    return route;
};
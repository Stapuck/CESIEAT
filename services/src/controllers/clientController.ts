import type { Context } from 'hono';
import Client from '../models/clientModel.js';
import {getAll, getById, createItem, updateItem, deleteItem} from './genericController.js'

export const getClients = (c: Context) => getAll(Client, c);
export const getClient = (c: Context) => getById(Client, c);
export const createClient = (c: Context) => createItem(Client, c);
export const updateClient = (c: Context) => updateItem(Client, c);
export const deleteClient = (c: Context) => deleteItem(Client, c);

// custom 
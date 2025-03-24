import type { Context } from 'hono';
import Livreur from '../models/livreurModel.js';
import {getAll, getById, createItem, updateItem, deleteItem} from './genericController.js'

export const getClients = (c: Context) => getAll(Livreur, c);
export const getClientById = (c: Context) => getById(Livreur, c);
export const createClient = (c: Context) => createItem(Livreur, c);
export const updateClient = (c: Context) => updateItem(Livreur, c);
export const deleteClient = (c: Context) => deleteItem(Livreur, c);

// custom 
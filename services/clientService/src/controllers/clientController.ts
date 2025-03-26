import type { Context } from 'hono';
import Client from '../models/clientModel.js';


export const getClients = async (c: Context) => {
    try {
        const clients = await Client.find({});
        return c.json(clients);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const getClient = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const client = await Client.findById(id);
        if (!client) return c.json({ message: `Client with ID ${id} not found` }, 404);
        return c.json(client);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const createClient = async (c: Context) => {
    try {
        const body = await c.req.json();
        const client = await Client.create(body);
        return c.json(client, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const editClient = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const client = await Client.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!client) return c.json({ message: `Client with ID ${id} not found` }, 404);
        return c.json(client);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const deleteClient = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const client = await Client.findByIdAndDelete(id);
        if (!client) return c.json({ message: `Client with ID ${id} not found` }, 404);
        return c.json({ message: `Client ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

import type { Context } from 'hono';
import Client from '../models/clientModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getClients = async (c: Context) => {
    try {
        const clients = await Client.find({});
        return c.json(clients);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
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
        return handleError(error, c);
    }
};

export const createClient = async (c: Context) => {
    try {
        const body = await c.req.json();
        const client = await Client.create(body);
        return c.json(client, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
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
        return handleError(error, c);
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
        return handleError(error, c);
    }
};

export const pauseClient = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const client = await Client.findByIdAndUpdate(
            id,
            { isPaused: true },
            { new: true, runValidators: true }
        );
        
        if (!client) {
            return c.json({ message: `Client with ID ${id} not found` }, 404);
        }
        
        return c.json({ message: `Client ${id} has been paused successfully`, client });
    } catch (error) {
        return handleError(error, c);
    }
};

export const getClientByZitadelId = async (c: Context) => {
    try {
        const zitadelId = c.req.param('zitadelId');
        const client = await Client.findOne({ clientId_Zitadel: zitadelId });
        if (!client) return c.json({ message: `Client with Zitadel ID ${zitadelId} not found` }, 404);
        return c.json(client);
    } catch (error) {
        return handleError(error, c);
    }
};

export const editClientByZitadelId = async (c: Context) => {
    try {
        const zitadelId = c.req.param('zitadelId');
        const body = await c.req.json();
        
        const client = await Client.findOneAndUpdate(
            { clientId_Zitadel: zitadelId }, 
            body, 
            { new: true, runValidators: true }
        );
        
        if (!client) {
            return c.json({ message: `Client avec Zitadel ID ${zitadelId} non trouvé` }, 404);
        }
        
        return c.json(client);
    } catch (error) {
        return handleError(error, c);
    }
};

export const deleteClientByZitadelId = async (c: Context) => {
    try {
        const zitadelId = c.req.param('zitadelId');
        const client = await Client.findOneAndDelete({ clientId_Zitadel: zitadelId });
        
        if (!client) {
            return c.json({ message: `Client with Zitadel ID ${zitadelId} not found` }, 404);
        }
        
        return c.json({ message: `Client with Zitadel ID ${zitadelId} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
}


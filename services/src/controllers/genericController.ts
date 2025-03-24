import type { Context } from 'hono';

export const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getAll = async (Model: any, c: Context) => {
    try {
        const data = await Model.find({});
        return c.json(data);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getById = async (Model: any, c: Context) => {
    try {
        const id = c.req.param('id');
        const item = await Model.findById(id);
        if (!item) return c.json({ message: `Item with ID ${id} not found` }, 404);
        return c.json(item);
    } catch (error) {
        return handleError(error, c);
    }
};

export const createItem = async (Model: any, c: Context) => {
    try {
        const body = await c.req.json();
        const item = await Model.create(body);
        return c.json(item, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

export const updateItem = async (Model: any, c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const item = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!item) return c.json({ message: `Item with ID ${id} not found` }, 404);
        return c.json(item);
    } catch (error) {
        return handleError(error, c);
    }
};

export const deleteItem = async (Model: any, c: Context) => {
    try {
        const id = c.req.param('id');
        const item = await Model.findByIdAndDelete(id);
        if (!item) return c.json({ message: `Item with ID ${id} not found` }, 404);
        return c.json({ message: `Item ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};

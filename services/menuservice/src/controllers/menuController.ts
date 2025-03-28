import type { Context } from 'hono';
import Menu from '../models/menuModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getMenus = async (c: Context) => {
    try {
        const menus = await Menu.find({});
        return c.json(menus);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const menu = await Menu.findById(id);
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json(menu);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const createMenu = async (c: Context) => {
    try {
        const body = await c.req.json();
        const menu = await Menu.create(body);
        return c.json(menu, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const editMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const menu = await Menu.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json(menu);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const deleteMenu = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const menu = await Menu.findByIdAndDelete(id);
        if (!menu) return c.json({ message: `Menu with ID ${id} not found` }, 404);
        return c.json({ message: `Menu ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getMenuByRestaurant = async (c: Context) => {
    try {
        const restaurantId = c.req.param('id');
        const menus = await Menu.find({ restaurant: restaurantId });
        if (!menus || menus.length === 0) return c.json({ message: `No menus found for restaurant with ID ${restaurantId}` }, 404);
        return c.json(menus);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return handleError(error, c);
    }
};

export const getMenuByRestaurantBody = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { restaurantId } = body;
        
        if (!restaurantId) {
            return c.json({ message: "Restaurant ID is required" }, 400);
        }
        
        const menus = await Menu.find({ restaurant: restaurantId });
        if (!menus || menus.length === 0) {
            return c.json({ message: `No menus found for this restaurant` }, 404);
        }
        
        return c.json(menus);
    } catch (error) {
        return handleError(error, c);
    }
};




import type { Context } from 'hono';
import Restaurateur from '../models/restaurateurModel.js';

const handleError = (error: unknown, c: Context) => {
    const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ message: errMsg }, 500);
};

export const getRestaurateurs = async (c: Context) => {
    try {
        const restaurateurs = await Restaurateur.find({});
        return c.json(restaurateurs);
    } catch (error) {
        return handleError(error, c);
    }
};

export const getRestaurateur = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const restaurant = await Restaurateur.findById(id);
        if (!restaurant) return c.json({ message: `Restaurant with ID ${id} not found` }, 404);
        return c.json(restaurant);
    } catch (error) {
        return handleError(error, c);
    }
};

export const createRestaurant = async (c: Context) => {
    try {
        const body = await c.req.json();
        const restaurant = await Restaurateur.create(body);
        return c.json(restaurant, 201);
    } catch (error) {
        return handleError(error, c);
    }
};

export const editRestaurant = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const restaurant = await Restaurateur.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!restaurant) return c.json({ message: `Restaurant with ID ${id} not found` }, 404);
        return c.json(restaurant);
    } catch (error) {
        return handleError(error, c);
    }
};

export const deleteRestaurant = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const restaurant = await Restaurateur.findByIdAndDelete(id);
        if (!restaurant) return c.json({ message: `Livreur with ID ${id} not found` }, 404);
        return c.json({ message: `Restaurant ${id} deleted successfully` });
    } catch (error) {
        return handleError(error, c);
    }
};



export const getRestaurateurByManagerId = async (c: Context) => {
    try {
        const managerid = c.req.param('managerid');
        const restaurant = await Restaurateur.find({ managerId : managerid });
        if (restaurant.length === 0) return c.json({ message: 'No restaurant found for this manager' }, 404);
        return c.json(restaurant);
    } catch (error) {
        return handleError(error, c);
    }
};


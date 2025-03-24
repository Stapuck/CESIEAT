import type { Context } from 'hono';
import Product from '../models/productModel.js';


export const getProducts = async (c: Context) => {
    try {
        const products = await Product.find({});
        return c.json(products);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const getProduct = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const product = await Product.findById(id);
        if (!product) return c.json({ message: `Product with ID ${id} not found` }, 404);
        return c.json(product);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const createProduct = async (c: Context) => {
    try {
        const body = await c.req.json();
        const product = await Product.create(body);
        return c.json(product, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const editProduct = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!product) return c.json({ message: `Product with ID ${id} not found` }, 404);
        return c.json(product);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const deleteProduct = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const product = await Product.findByIdAndDelete(id);
        if (!product) return c.json({ message: `Product with ID ${id} not found` }, 404);
        return c.json({ message: `Product ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

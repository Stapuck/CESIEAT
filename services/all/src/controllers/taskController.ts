import type { Context } from 'hono';
import Task from '../models/taskModel.js';


export const getTasks = async (c: Context) => {
    try {
        const task = await Task.find({});
        return c.json(task);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const getTask = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const task = await Task.findById(id);
        if (!task) return c.json({ message: `Task with ID ${id} not found` }, 404);
        return c.json(task);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const createTask = async (c: Context) => {
    try {
        const body = await c.req.json();
        const task = await Task.create(body);
        return c.json(task, 201);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const editTask = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const task = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!task) return c.json({ message: `Task with ID ${id} not found` }, 404);
        return c.json(task);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const deleteTask = async (c: Context) => {
    try {
        const id = c.req.param('id');
        const task = await Task.findByIdAndDelete(id);
        if (!task) return c.json({ message: `Task with ID ${id} not found` }, 404);
        return c.json({ message: `Task ${id} deleted successfully` });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};


// custom

export const getCompletedTasks = async (c: Context) => {
    try {
        const tasks = await Task.find({ completed: true });

        if (tasks.length === 0) {
            return c.json({ message: "No completed tasks found" }, 404);
        }

        return c.json(tasks);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};

export const getTasksByTitle = async (c: Context) => {
    try {
        const title = c.req.param('title');
        const tasks = await Task.find({ title });

        // const { title } = req.params; 
        // const tasks = await Task.find({ title: title });

        if (tasks.length === 0) {
            return c.json({ message: `No tasks found with title: ${title}` }, 404);
        }

        return c.json(tasks);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        return c.json({ message: errMsg }, 500);
    }
};



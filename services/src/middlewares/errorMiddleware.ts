import type { Context } from 'hono';

export const errorMiddleware = async (c: Context, next: () => Promise<void>) => {
    try {
        await next();
    } catch (err) {
        const statusCode = c.res.status as number || 500;
        const errMsg = err instanceof Error ? err.message : 'An unknown error occurred';
        const errStack = err instanceof Error ? err.stack : null;
        
        return c.json({
            message: errMsg,
            stack: process.env.NODE_ENV === "development" ? errStack : null
        }, statusCode as 400 | 401 | 403 | 404 | 500);
    }
};
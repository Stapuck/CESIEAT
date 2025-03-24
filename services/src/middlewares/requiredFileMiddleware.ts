import type { Context } from 'hono';

export const validateFields = (requiredFields: string[]) => {
    return async (c: Context, next: () => Promise<void>) => {
        const body = await c.req.json();
        const missingFields: string[] = [];

        requiredFields.forEach((field) => {
            if (!body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return c.json({
                error: `Les champs suivants sont requis : ${missingFields.join(', ')}`
            }, 400);
        }

        await next();
    };
};



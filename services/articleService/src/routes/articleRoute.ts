import { Hono } from 'hono'
import { getArticles, getArticle, createArticle, editArticle, deleteArticle, getArticlesByRestorateur } from '../controllers/articleController.js'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/arktype'
import { apiReference } from '@scalar/hono-api-reference'
import { type } from 'arktype'

const baseUrl = "/api/articles"
const articleRoute = new Hono().basePath(baseUrl)


articleRoute.get(
    '/',
    describeRoute({
        tags: ['articles'],
        description: 'Get all articles',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('query', type({})),
    getArticles
)

articleRoute.get(
    '/:id',
    describeRoute({
        tags: ['articles'],
        description: 'Get article by id',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('param', type({ id: "string" })),
    getArticle
)

articleRoute.put(
    '/:id',
    describeRoute({
        tags: ['articles'],
        description: 'Put article by id',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('param', type({ id: "string" })),
    editArticle
)

articleRoute.post(
    '/',
    describeRoute({
        tags: ['articles'],
        description: 'Create an article',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    // validator('param', type({ id: "string" })),
    createArticle
)

articleRoute.delete(
    '/:id',
    describeRoute({
        tags: ['articles'],
        description: 'create article',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('param', type({ id: "string" })),
    deleteArticle
)

articleRoute.get(
    '/restaurateur/:restaurateurid',
    describeRoute({
        tags: ['articles'],
        description: 'create article',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('param', type({ restaurateurid: "string" })),
    getArticlesByRestorateur
)


const openapi_url = "/dev/openapi"
articleRoute.get(
    openapi_url,
    openAPISpecs(articleRoute, {
        documentation: {
            info: {
                title: 'CESI Eats API Articles',
                version: '1.0.0',
                description: 'Articles API',
            },
            servers: [
                { url: `https://localhost:8080`, description: 'Local Server' },
            ],
        },
    })
)

const scalar_url = "/dev/docs"
articleRoute.get(
    scalar_url,
    apiReference({
        // theme: 'saturn',
        url: `https://localhost:8080${baseUrl}${openapi_url}`,
    }),
)

console.log(`https://localhost:8080${baseUrl}${scalar_url}`)
console.log(`https://localhost:8080${baseUrl}${openapi_url}`)

export default articleRoute
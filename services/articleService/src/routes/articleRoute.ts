import { Hono } from 'hono'
import { getArticles, getArticle, createArticle, editArticle, deleteArticle, getArticlesByRestorateur } from '../controllers/articleController.js'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/arktype'
import { apiReference } from '@scalar/hono-api-reference'
import { articleArkType } from '../models/articleModel.js'

import { type } from 'arktype'
import { arktypeValidator } from '@hono/arktype-validator'

const baseUrl = "/api/articles"
const articleRoute = new Hono().basePath(baseUrl)

const schema = type({
    name: 'string',
    age: 'number',
})


articleRoute.get(
    '/',
    describeRoute({
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

// articleRoute.get(
//     '/:id',
//     describeRoute({
//         description: 'Get all articles',
//         responses: {
//             200: {
//                 description: 'Successful response',
//             },
//         },
//     }),
//     validator('query', type({id : "string"})),
//     getArticle
// )

articleRoute.put(
    '/:id',
    describeRoute({
        description: 'Get all articles',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    validator('query', type({id : "string"})),
    editArticle
)
// articleRoute.put(
//     '/:id',
//     describeRoute({
//         description: 'edit article by id',
//         responses: {
//             200: {
//                 description: 'Successful response',
//             },
//         },
//     }),
//     validator('query', type({ id: "string" })),
//     editArticle
// )


articleRoute.get('/:id', getArticle)
// articleRoute.post('/', createArticle)
// articleRoute.put('/:id', editArticle)
// articleRoute.delete('/:id', deleteArticle)
// articleRoute.get('/restaurateur/:restaurateurid', getArticlesByRestorateur)


articleRoute.get(
    '/openapi',
    openAPISpecs(articleRoute, {
        documentation: {
            info: {
                title: 'Hono API',
                version: '1.0.0',
                description: 'Articles API',
            },
            servers: [
                { url: 'http://localhost:3005', description: 'Local Server' },
            ],
        },
    })
)

articleRoute.get(
    '/docs',
    apiReference({
        theme: 'saturn',
        url: '/api/articles/openapi',
    }),
)
console.log("http://localhost:3005/api/articles/openapi")
console.log("http://localhost:3005/api/articles/docs")

export default articleRoute
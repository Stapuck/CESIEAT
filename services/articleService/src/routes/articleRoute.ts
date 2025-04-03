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
// const articleRoute = new Hono()

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

articleRoute.get(
    '/:id',
    describeRoute({
        description: 'Get all articles',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    // validator('query', type("string")),
    // validator('query', type({id : mongoose.Types.ObjectId.toString()})),
    getArticle
)

articleRoute.put(
    '/:id',
    describeRoute({
        description: 'Get article',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    // validator('query', type("string")),
    // validator('query', type({id : mongoose.Types.ObjectId.toString()})),
    editArticle
)

articleRoute.post(
    '/:id',
    describeRoute({
        description: 'create article',
        responses: {
            200: {
                description: 'Successful response',
            },
        },
    }),
    // validator('query', type("string")),
    // validator('query', type({id : mongoose.Types.ObjectId.toString()})),
    createArticle
)



// articleRoute.get(':id', getArticle)
// articleRoute.post('/', createArticle)
// articleRoute.put('/:id', editArticle)
// articleRoute.delete('/:id', deleteArticle)
// articleRoute.get('/restaurateur/:restaurateurid', getArticlesByRestorateur)



// ========================================================================================
// ========================================================================================
// ========================================================================================

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
                { url: `http://localhost:3005${baseUrl}${openapi_url}`, description: 'Local Server' },
            ],
        },
    })
)

const scalar_url = "/dev/docs"
articleRoute.get(
    scalar_url,
    apiReference({
        // theme: 'saturn',
        url: `http://localhost:3005${baseUrl}${openapi_url}`,
    }),
)

console.log(`http://localhost:3005${baseUrl}${scalar_url}`)
console.log(`http://localhost:3005${baseUrl}${openapi_url}`)

export default articleRoute
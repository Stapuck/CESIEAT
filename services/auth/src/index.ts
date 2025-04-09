import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getZitadelToken } from './zitadelAuth.js'
import { logger } from 'hono/logger'

const app = new Hono({ strict: false })

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/auth', async (c) => {
  const access_token = await getZitadelToken()
  return c.json({ access_token })
})

app.post('/auth/users', async (c) => {
  const access_token = await getZitadelToken()

  const url = 'https://instance1-el5q1i.zitadel.cloud/management/v1/users/_search'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        query: {
          offset: "0",
          limit: 100,
          asc: true
        },
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
    return c.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ error })
  }
})

app.post('/auth/deactivate/:userId', async (c) => {

  const { userId } = c.req.param()

  const access_token = await getZitadelToken()

  const url = `https://instance1-el5q1i.zitadel.cloud/v2/users/${userId}/deactivate`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({})
    })

    if (!response.ok) {
      const errorBody = await response.json()
      return c.json(errorBody, response.status) // ⬅️ send the exact body + status code
    }

    const data = await response.json()
    return c.json({ data })

  } catch (error) {
    console.error("🔥 Unexpected fetch error:", error)
    return c.json({ message: "Internal error", error: String(error) }, 500)
  }
})

app.post('/auth/reactivate/:userId', async (c) => {

  const { userId } = c.req.param()

  const access_token = await getZitadelToken()

  const url = `https://instance1-el5q1i.zitadel.cloud/v2/users/${userId}/reactivate`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({})
    })

    if (!response.ok) {
      const errorBody = await response.json()
      return c.json(errorBody, response.status) // ⬅️ send the exact body + status code
    }

    const data = await response.json()
    return c.json({ data })

  } catch (error) {
    console.error("🔥 Unexpected fetch error:", error)
    return c.json({ message: "Internal error", error: String(error) }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3002
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
